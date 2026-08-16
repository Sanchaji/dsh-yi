/**
 * ☯ session-header button and the divination modal.
 * Uses plain React state and inline styles so the plugin does not need
 * ui-primitives, locale, or CSS-module tooling for the first version.
 */
import { useState, type CSSProperties, type ReactNode } from 'react'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { lineMeta, type DivinationLine, type DivinationMethod, type DivinationRequest, type DivinationResult, type DivinationTopic, type LineValue } from '../shared.ts'
import type { DivinationInjected } from './index.ts'

export type DivinationButtonProps =
  PropsRuntime<'conversation.session.header.actions'>
  & InjectFace<DivinationInjected>

const TOPICS: readonly { value: DivinationTopic; label: string }[] = [
  { value: 'career', label: '事业' },
  { value: 'family', label: '家庭' },
  { value: 'project', label: '当前项目' },
  { value: 'custom', label: '自定义' },
]

type CoinFace = 'yang' | 'yin'

interface TossResult {
  readonly line: DivinationLine
  readonly coins: readonly CoinFace[]
}

const EMPTY_TOSSES: readonly (TossResult | null)[] = [null, null, null, null, null, null]

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const panelStyle: CSSProperties = {
  background: '#fff',
  color: '#222',
  borderRadius: 14,
  padding: 24,
  maxWidth: 580,
  width: '92%',
  maxHeight: '82vh',
  overflow: 'auto',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
  fontFamily: 'system-ui, sans-serif',
}

const titleStyle: CSSProperties = {
  margin: '0 0 16px',
  fontSize: 20,
  fontWeight: 700,
}

const labelStyle: CSSProperties = {
  display: 'block',
  margin: '14px 0 6px',
  fontSize: 13,
  fontWeight: 600,
  color: '#555',
}

const chipRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
}

const chipStyle = (active: boolean): CSSProperties => ({
  border: active ? '2px solid #2563eb' : '1px solid #d0d0d0',
  background: active ? '#eff6ff' : '#fff',
  color: active ? '#1e40af' : '#333',
  borderRadius: 999,
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 14,
})

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d0d0d0',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 14,
  marginTop: 6,
}

const lineRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: 8,
}

const tossButtonStyle: CSSProperties = {
  border: '1px solid #c7c7c7',
  background: '#f8f8f8',
  borderRadius: 8,
  padding: '6px 10px',
  cursor: 'pointer',
  fontSize: 13,
}

const primaryButtonStyle: CSSProperties = {
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 10,
  padding: '10px 18px',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 18,
}

const closeButtonStyle: CSSProperties = {
  border: '1px solid #d0d0d0',
  background: '#fff',
  color: '#333',
  borderRadius: 10,
  padding: '10px 16px',
  fontSize: 14,
  cursor: 'pointer',
  marginTop: 18,
  marginLeft: 8,
}

const resultBoxStyle: CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  background: '#fafafa',
  padding: '14px 16px',
  marginTop: 16,
  whiteSpace: 'pre-wrap',
}

function randomToss(): TossResult {
  const coins: CoinFace[] = [0, 1, 2].map(() => (Math.random() < 0.5 ? 'yang' : 'yin'))
  const yangCount = coins.filter(coin => coin === 'yang').length
  // 0 个阳 = 6 老阴, 1 个阳 = 7 少阳, 2 个阳 = 8 少阴, 3 个阳 = 9 老阳
  const value = (6 + yangCount) as LineValue
  return { line: lineMeta(value), coins }
}

function manualReady(tosses: readonly (TossResult | null)[]): boolean {
  return tosses.every(toss => toss !== null)
}

function lineSymbol(line: DivinationLine): string {
  return line.yin ? '- -' : '—'
}

function coinFace(coin: CoinFace): string {
  return coin === 'yang' ? '○' : '●'
}

function topicLabel(topic: DivinationTopic): string {
  return TOPICS.find(item => item.value === topic)?.label ?? topic
}

/**
 * The ☯ header action. Renders a small button and, when clicked, a modal that
 * guides the user through topic/method selection and shows the LLM reading.
 */
export function DivinationButton({ runDivination }: DivinationButtonProps) {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState<DivinationTopic>('career')
  const [customText, setCustomText] = useState('')
  const [method, setMethod] = useState<DivinationMethod>('auto')
  const [manualTosses, setManualTosses] = useState<readonly (TossResult | null)[]>(EMPTY_TOSSES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DivinationResult | null>(null)

  const reset = (): void => {
    setTopic('career')
    setCustomText('')
    setMethod('auto')
    setManualTosses(EMPTY_TOSSES)
    setLoading(false)
    setError(null)
    setResult(null)
  }

  const close = (): void => {
    setOpen(false)
    reset()
  }

  const tossLine = (index: number): void => {
    setManualTosses(current => {
      const next = [...current]
      next[index] = randomToss()
      return next
    })
  }

  const start = async (): Promise<void> => {
    const request: DivinationRequest = method === 'auto'
      ? {
        topic,
        ...(topic === 'custom' ? { customText: customText.trim() } : {}),
        method,
      }
      : {
        topic,
        ...(topic === 'custom' ? { customText: customText.trim() } : {}),
        method,
        lines: manualTosses.map(toss => (toss as TossResult).line.value),
      }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const value = await runDivination(request)
      setResult(value)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      setLoading(false)
    }
  }

  const trigger: ReactNode = (
    <button
      type="button"
      aria-label="周易测算"
      title="周易测算"
      onClick={() => { setOpen(true) }}
      style={{
        border: '1px solid transparent',
        background: 'transparent',
        borderRadius: 8,
        padding: '2px 6px',
        cursor: 'pointer',
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      ☯
    </button>
  )

  if (!open) return trigger

  const canStart = method === 'auto' || manualReady(manualTosses)

  return (
    <>
      {trigger}
      <div style={overlayStyle} onClick={(event) => { if (event.target === event.currentTarget) close() }}>
        <div style={panelStyle} role="dialog" aria-modal="true" aria-label="周易测算">
          <h2 style={titleStyle}>☯ 周易测算</h2>

          <span style={labelStyle}>想测什么？</span>
          <div style={chipRowStyle}>
            {TOPICS.map(item => (
              <button
                key={item.value}
                type="button"
                style={chipStyle(topic === item.value)}
                onClick={() => { setTopic(item.value); setResult(null) }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {topic === 'custom'
            ? (
              <input
                style={inputStyle}
                value={customText}
                placeholder="输入你想测算的事情"
                onChange={(event) => { setCustomText(event.target.value); setResult(null) }}
              />
            )
            : null}

          <span style={labelStyle}>起卦方式</span>
          <div style={chipRowStyle}>
            <button type="button" style={chipStyle(method === 'auto')} onClick={() => { setMethod('auto'); setResult(null) }}>
              一键测算
            </button>
            <button type="button" style={chipStyle(method === 'manual')} onClick={() => { setMethod('manual'); setResult(null) }}>
              手动投掷三枚硬币
            </button>
          </div>

          {method === 'manual'
            ? (
              <div>
                <span style={labelStyle}>依次掷出六爻（从下到上）</span>
                {manualTosses.map((toss, index) => (
                  <div key={index} style={lineRowStyle}>
                    <span style={{ width: 64, fontSize: 13, color: '#555' }}>
                      第 {index + 1} 爻
                    </span>
                    <button type="button" style={tossButtonStyle} onClick={() => tossLine(index)}>
                      {toss === null ? '掷币' : '重掷'}
                    </button>
                    <span style={{ fontSize: 18, letterSpacing: 4, color: toss === null ? '#bbb' : '#111', minWidth: 64 }}>
                      {toss === null ? '○ ○ ○' : toss.coins.map(coinFace).join(' ')}
                    </span>
                    <span style={{ fontSize: 14, color: toss === null ? '#aaa' : '#111' }}>
                      {toss === null ? '尚未掷出' : `${toss.line.label}（${toss.line.value}） ${lineSymbol(toss.line)}`}
                    </span>
                  </div>
                ))}
              </div>
            )
            : null}

          {error !== null ? <div style={{ ...resultBoxStyle, color: '#b91c1c', borderColor: '#fecaca' }}>{error}</div> : null}

          {result !== null
            ? (
              <div style={resultBoxStyle}>
                <div><strong>测问：</strong>{result.question}</div>
                <div><strong>六爻：</strong>{result.lines.map((line, index) => `${index + 1}${line.label} ${lineSymbol(line)}`).join('  ')}</div>
                <div><strong>本卦：</strong>第 {result.original.number} 卦 {result.original.name} — {result.original.judgment}</div>
                {result.changed !== undefined
                  ? <div><strong>变卦：</strong>第 {result.changed.number} 卦 {result.changed.name} — {result.changed.judgment}</div>
                  : <div><strong>变卦：</strong>六爻不动</div>}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
                <div style={{ whiteSpace: 'pre-wrap' }}>{result.llmText}</div>
              </div>
            )
            : null}

          <div>
            <button
              type="button"
              style={primaryButtonStyle}
              disabled={!canStart || loading}
              onClick={() => { void start() }}
            >
              {loading ? '测算中…' : '开始测算'}
            </button>
            <button type="button" style={closeButtonStyle} onClick={close}>
              关闭
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
