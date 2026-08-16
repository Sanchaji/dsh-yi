/**
 * @dsh-external/dsh-yi — Host half.
 * Registers a `/divinate` command that performs I Ching coin casting and asks
 * the session's currently connected LLM to interpret the result.
 */
import type { Context } from 'cordis';
import z from 'schemastery';
import type LlmService from '@deepseek-ai/dsh-llm';
import type { CommandRuntime } from '@deepseek-ai/dsh-commands';
type AppContext = Context & {
    commands: CommandRuntime;
    llm: LlmService;
};
export declare const name = "@dsh-external/dsh-yi";
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
export declare const Config: z<Schemastery.ObjectS<{
    provider: z<string, string>;
    model: z<string, string>;
    maxTokens: z<number, number>;
    temperature: z<number, number>;
    timeoutMs: z<number, number>;
}>, Schemastery.ObjectT<{
    provider: z<string, string>;
    model: z<string, string>;
    maxTokens: z<number, number>;
    temperature: z<number, number>;
    timeoutMs: z<number, number>;
}>>;
export declare function apply(ctx: AppContext, config: Config): void;
export {};
