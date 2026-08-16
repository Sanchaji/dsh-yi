/**
 * dsh-yi — Client half.
 * Registers a ☯ button in the session header action row and opens the
 * divination modal. Host communication goes through the existing
 * `remote.commands.execute` channel, so no custom Remote service is needed.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import type { DivinationRequest, DivinationResult } from '../shared.ts';
export type { DivinationButtonProps } from './DivinationButton.tsx';
/** Business face injected into the header action component. */
export interface DivinationInjected {
    /** Run one divination request through the host `/divinate` command. */
    runDivination: (request: DivinationRequest) => Promise<DivinationResult>;
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
