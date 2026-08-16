import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { DivinationInjected } from './index.ts';
export type DivinationButtonProps = PropsRuntime<'conversation.session.header.actions'> & InjectFace<DivinationInjected>;
/**
 * The ☯ header action. Renders a small button and, when clicked, a modal that
 * guides the user through topic/method selection and shows the LLM reading.
 */
export declare function DivinationButton({ runDivination }: DivinationButtonProps): import("react").JSX.Element;
