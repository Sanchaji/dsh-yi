import { DivinationButton } from "./DivinationButton.js";
export const inject = ['slots', 'remote', 'remote.commands', 'locale'];
export function apply(ctx) {
    ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
        name: 'conversation.session.header.actions',
        id: 'dsh-yi',
        // After the static session context, before the jobs/subagent utilities.
        order: 10,
        inject: (sessionId) => ({
            runDivination: async (request) => {
                const execution = await ctx.remote.commands.execute(sessionId, `/divinate ${JSON.stringify({ ...request, language: ctx.locale.getLocale().active })}`, []);
                if (!execution.ok) {
                    throw new Error(execution.error.message);
                }
                const commandExecution = execution.value;
                if (commandExecution === undefined) {
                    throw new Error('/divinate 命令不存在，请确认 dsh-yi host 插件已加载');
                }
                if (commandExecution.result.kind === 'error') {
                    throw new Error(commandExecution.result.text);
                }
                const text = commandExecution.result.text;
                if (text === undefined || text.length === 0) {
                    throw new Error('测算结果为空');
                }
                return JSON.parse(text);
            },
        }),
    }, DivinationButton));
}
//# sourceMappingURL=index.js.map