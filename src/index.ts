/**
 * dsh-yi — Host half.
 * Registers a `/divinate` command that performs I Ching coin casting and asks
 * the session's currently connected LLM to interpret the result.
 */
import type { Context } from 'cordis'
import z from 'schemastery'
import type LlmService from '@deepseek-ai/dsh-llm'
import type { FinishReason } from '@deepseek-ai/dsh-llm'
import { BlockAssembler, createUserMessage, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { CommandInvocation, CommandRuntime } from '@deepseek-ai/dsh-commands'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { castLines, changedHexagram, hexagramByBinary, linesFromValues, binaryFromLines, toHexagramInfo } from './iching/engine.ts'
import {
  questionText,
  type DivinationRequest,
  type DivinationResult,
  type DivinationTopic,
  type DivinationMethod,
  type LineValue,
} from './shared.ts'

type AppContext = Context & {
  commands: CommandRuntime
  llm: LlmService
}

export const name = 'dsh-yi'
export const inject = ['commands', 'llm']

export interface Config {
  /** Optional explicit provider override; must be paired with `model`. */
  provider?: string
  /** Optional explicit model override; must be paired with `provider`. */
  model?: string
  /** Auxiliary LLM output-token cap. */
  maxTokens: number
  /** Sampling temperature for the interpretation call. */
  temperature: number
  /** End-to-end auxiliary LLM deadline in milliseconds. */
  timeoutMs: number
}

export const Config = z.object({
  provider: z.string(),
  model: z.string(),
  maxTokens: z.number().min(1).default(2000),
  temperature: z.number().min(0).max(2).default(0.8),
  timeoutMs: z.number().min(1).default(30000),
})

const TOPICS: readonly DivinationTopic[] = ['career', 'family', 'project', 'custom']
const METHODS: readonly DivinationMethod[] = ['auto', 'manual']
const LINE_VALUES: readonly LineValue[] = [6, 7, 8, 9]

function isLineValue(value: unknown): value is LineValue {
  return typeof value === 'number' && (LINE_VALUES as readonly number[]).includes(value)
}

function parseRequest(raw: string): DivinationRequest {
  const text = raw.trim()
  if (text.length === 0) throw new Error('缺少测算参数')
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('测算参数不是合法 JSON')
  }
  if (typeof data !== 'object' || data === null) throw new Error('测算参数必须是 JSON 对象')
  const request = data as Record<string, unknown>
  if (!TOPICS.includes(request.topic as DivinationTopic)) {
    throw new Error('topic 必须是 career / family / project / custom 之一')
  }
  if (!METHODS.includes(request.method as DivinationMethod)) {
    throw new Error('method 必须是 auto / manual 之一')
  }
  const topic = request.topic as DivinationTopic
  const method = request.method as DivinationMethod
  const customText = typeof request.customText === 'string' ? request.customText : undefined
  if (topic === 'custom' && (customText === undefined || customText.trim().length === 0)) {
    throw new Error('自定义测算需要提供 customText')
  }
  let lines: readonly LineValue[] | undefined
  if (method === 'manual') {
    if (!Array.isArray(request.lines) || request.lines.length !== 6 || !request.lines.every(isLineValue)) {
      throw new Error('手动起卦需要提供 6 个爻值（6/7/8/9）')
    }
    lines = request.lines as readonly LineValue[]
  }
  return { topic, customText, method, lines }
}

function resolveRoute(agent: Agent, config: Config): { provider: string; model: string } {
  if (config.provider !== undefined && config.model !== undefined) {
    if (config.provider.length === 0 || config.model.length === 0) {
      throw new Error('provider 和 model 必须同时为非空字符串')
    }
    return { provider: config.provider, model: config.model }
  }
  const events = agent.session.events
  for (let index = events.length - 1; index >= 0; index--) {
    const event = events[index]
    if (event.type === 'request/header') {
      const header = event.data.header.config
      if (header.provider !== undefined && header.model !== undefined) {
        return { provider: header.provider, model: header.model }
      }
    }
  }
  throw new Error('无法确定当前 LLM 路由：请在插件配置中提供 provider 和 model')
}

function buildPrompt(question: string, lines: readonly { label: string; changing: boolean }[], originalName: string, originalJudgment: string, changed?: { name: string; judgment: string }): string {
  const lineText = lines
    .map((line, index) => `${index + 1}. ${line.label}${line.changing ? '（动爻）' : ''}`)
    .join('\n')
  const changedText = changed === undefined
    ? '本卦六爻不动，无变卦。'
    : `变卦：${changed.name}。${changed.judgment}`
  return [
    `测问内容：${question}`,
    '',
    '六爻（从下到上）：',
    lineText,
    '',
    `本卦：${originalName}。${originalJudgment}`,
    changedText,
    '',
    '请结合卦辞、爻象和测问内容，给出一段诚恳、通俗又有启发性的解读。',
  ].join('\n')
}

function systemPromptForLanguage(language: string | undefined): string {
  const base = '你是一位精通《周易》的解卦师。语气诚恳、通俗，可以带一点古典韵味，但不要恐吓，也不要作绝对化的人生判决。'
  if (language === 'en') {
    return `${base}\nCurrent DSH working language is English. Reply in English. For I Ching terms (hexagram names and judgments), keep the original Chinese term and add an English translation/explanation in parentheses.`
  }
  return `${base}\n当前 DSH 工作语言为中文。请用中文回答；卦名、卦辞等术语保留中文原文，并在需要时用通俗的话解释。`
}

function finishError(finish: FinishReason): Error | undefined {
  switch (finish.kind) {
    case 'stop':
      return undefined
    case 'error':
    case 'aborted': {
      const error = new Error(`LLM 调用失败：${finish.failure.message}（${finish.failure.code}）`) as Error & { code?: string }
      error.code = finish.failure.code
      return error
    }
    case 'max-tokens':
      return new Error('LLM 输出达到 maxTokens 上限，未能生成完整解读')
    case 'tool-calls':
      return new Error('LLM 意外要求调用工具，未返回解读文本')
    default:
      return new Error(`LLM 返回了未知结束原因：${String((finish as { kind?: unknown }).kind)}`)
  }
}

function textFromAssembler(assembler: BlockAssembler): string {
  const terminalError = finishError(assembler.finish)
  if (terminalError !== undefined) throw terminalError
  const text = assembler.blocks()
    .filter((block): block is Extract<ReturnType<BlockAssembler['blocks']>[number], { type: 'text' }> => block.type === 'text')
    .map(block => block.text)
    .join('')
    .trim()
  if (text.length === 0) {
    throw new Error(`LLM 没有返回解读内容（finish=${assembler.finish.kind}）`)
  }
  return text
}

async function runDivination(
  ctx: AppContext,
  config: Config,
  agent: Agent,
  request: DivinationRequest,
  signal: AbortSignal,
): Promise<DivinationResult> {
  const question = questionText(request.topic, request.customText)
  const lines = request.method === 'auto' ? castLines() : linesFromValues(request.lines ?? [])
  const binary = binaryFromLines(lines)
  const originalRecord = hexagramByBinary(binary)
  const changedRecord = changedHexagram(lines)
  const original = toHexagramInfo(originalRecord)
  const changed = changedRecord === undefined ? undefined : toHexagramInfo(changedRecord)

  const route = resolveRoute(agent, config)
  const prompt = buildPrompt(question, lines, original.name, original.judgment, changed)
  const system = systemPromptForLanguage(request.language)
  const assembler = new BlockAssembler()
  const options = {
    provider: route.provider,
    model: route.model,
    system,
    messages: [createUserMessage({
      content: [{ type: 'text', text: prompt }],
      source: { kind: 'plugin', plugin: 'dsh-yi' },
    })],
    maxTokens: config.maxTokens,
    temperature: config.temperature,
    reasoningEffort: ReasoningEffortId('off'),
    sessionId: agent.session.id,
    signal,
  }
  for await (const chunk of ctx.llm.stream(options)) {
    assembler.push(chunk)
  }
  const llmText = textFromAssembler(assembler)
  if (llmText.length === 0) throw new Error('LLM 没有返回解读内容')

  return { question, method: request.method, lines, original, ...(changed === undefined ? {} : { changed }), llmText }
}

export function apply(ctx: AppContext, config: Config): void {
  ctx.commands.register({
    name: 'divinate',
    description: '周易测算：一键起卦或手动投掷三枚硬币，并由当前 LLM 解读',
    input: { hint: 'JSON 参数（UI 会调用，也可手动输入）' },
    async handler(invocation: CommandInvocation) {
      try {
        const request = parseRequest(invocation.rawInput)
        const result = await runDivination(ctx, config, invocation.agent, request, invocation.signal)
        return { kind: 'success', text: JSON.stringify(result) }
      } catch (error) {
        return {
          kind: 'error',
          text: error instanceof Error ? error.message : String(error),
        }
      }
    },
  })
}
