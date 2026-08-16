/**
 * Shared wire types between the host command handler and the browser UI.
 * Keep this module dependency-free so both the Node bundle and the client
 * bundle can import it without dragging in the full 64-hexagram data table.
 */

export type DivinationTopic = 'career' | 'family' | 'project' | 'custom'

export type DivinationMethod = 'auto' | 'manual'

/** Coin-toss line values: 6 老阴, 7 少阳, 8 少阴, 9 老阳. */
export type LineValue = 6 | 7 | 8 | 9

export interface DivinationLine {
  /** Line value from the bottom (index 0) to the top (index 5). */
  readonly value: LineValue
  readonly label: '老阴' | '少阳' | '少阴' | '老阳'
  readonly yin: boolean
  readonly changing: boolean
}

export interface DivinationRequest {
  readonly topic: DivinationTopic
  /** Required when topic is 'custom'. */
  readonly customText?: string
  readonly method: DivinationMethod
  /** Six line values from bottom to top; required when method is 'manual'. */
  readonly lines?: readonly LineValue[]
  /** Current DSH UI language, e.g. 'zh' or 'en'; used to shape the LLM reply language. */
  readonly language?: string
}

export interface HexagramInfo {
  readonly number: number
  readonly name: string
  readonly upper: string
  readonly lower: string
  readonly binary: string
  readonly judgment: string
}

export interface DivinationResult {
  readonly question: string
  readonly method: DivinationMethod
  readonly lines: readonly DivinationLine[]
  readonly original: HexagramInfo
  readonly changed?: HexagramInfo
  readonly llmText: string
}

export const DIVINATION_TOPIC_LABELS: Readonly<Record<DivinationTopic, string>> = {
  career: '事业',
  family: '家庭',
  project: '当前项目',
  custom: '自定义',
}

export function lineMeta(value: LineValue): DivinationLine {
  switch (value) {
    case 6:
      return { value, label: '老阴', yin: true, changing: true }
    case 7:
      return { value, label: '少阳', yin: false, changing: false }
    case 8:
      return { value, label: '少阴', yin: true, changing: false }
    case 9:
      return { value, label: '老阳', yin: false, changing: true }
    default:
      throw new Error(`invalid line value: ${String(value)}`)
  }
}

export function questionText(topic: DivinationTopic, customText?: string): string {
  if (topic === 'custom') {
    const text = customText?.trim()
    if (!text) throw new Error('自定义测算内容不能为空')
    return text
  }
  return DIVINATION_TOPIC_LABELS[topic]
}
