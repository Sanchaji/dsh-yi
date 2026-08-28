/**
 * dsh-yi — Client half.
 * Registers a ☯ button in the session header action row and opens the
 * divination modal. Host communication goes through the existing
 * `remote.commands.execute` channel, so no custom Remote service is needed.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { DivinationRequest, DivinationResult } from '../shared.ts'
import { DivinationButton } from './DivinationButton.tsx'

export type { DivinationButtonProps } from './DivinationButton.tsx'

/** Business face injected into the header action component. */
export interface DivinationInjected {
  /** Run one divination request through the host `/divinate` command. */
  runDivination: (request: DivinationRequest) => Promise<DivinationResult>
}

export const inject = ['slots', 'remote', 'remote.commands', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.slots.inject(
    'conversation.session.header.actions',
    () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'dsh-yi',
      // After the static session context, before the jobs/subagent utilities.
      order: 10,
      inject: (sessionId: SessionId): DivinationInjected => ({
        runDivination: async (request) => {
          const execution = await ctx.remote.commands.execute(
            sessionId,
            `/divinate ${JSON.stringify({ ...request, language: ctx.locale.getLocale().active })}`,
            [],
          )
          if (!execution.ok) {
            throw new Error(execution.error.message)
          }
          const commandExecution = execution.value
          if (commandExecution === undefined) {
            throw new Error('/divinate 命令不存在，请确认 dsh-yi host 插件已加载')
          }
          if (commandExecution.result.kind === 'error') {
            throw new Error(commandExecution.result.text)
          }
          const text = commandExecution.result.text
          if (text === undefined || text.length === 0) {
            throw new Error('测算结果为空')
          }
          return JSON.parse(text) as DivinationResult
        },
      }),
    }, DivinationButton),
  )
}
