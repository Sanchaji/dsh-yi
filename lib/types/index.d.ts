/**
 * dsh-yi — Host half.
 * Registers a `/divinate` command that performs I Ching coin casting and asks
 * the session's currently connected LLM to interpret the result.
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type LlmService from '@deepseek-ai/dsh-llm';
import type { CommandRuntime } from '@deepseek-ai/dsh-commands';
/**
 * `MessageSourceMap` is merge-extensible and has no shared catch-all `plugin`
 * kind, so this plugin declares its own attribution for the synthesized
 * user-role message it sends to the auxiliary interpretation call.
 */
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'dsh-yi': {
            kind: 'dsh-yi';
        };
    }
}
type AppContext = Context & {
    commands: CommandRuntime;
    llm: LlmService;
};
export declare const name = "dsh-yi";
export declare const inject: string[];
export interface Config {
    /** Optional explicit provider override; must be paired with `model`. */
    provider?: string;
    /** Optional explicit model override; must be paired with `provider`. */
    model?: string;
    /** Auxiliary LLM output-token cap. */
    maxTokens: number;
    /** Sampling temperature for the interpretation call. */
    temperature: number;
    /** End-to-end auxiliary LLM deadline in milliseconds. */
    timeoutMs: number;
}
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    provider: z<string, string, "plain">;
    model: z<string, string, "plain">;
    maxTokens: z<number, number, "defined">;
    temperature: z<number, number, "defined">;
    timeoutMs: z<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    provider: z<string, string, "plain">;
    model: z<string, string, "plain">;
    maxTokens: z<number, number, "defined">;
    temperature: z<number, number, "defined">;
    timeoutMs: z<number, number, "defined">;
}>>, "plain">;
export declare function apply(ctx: AppContext, config: Config): void;
export {};
