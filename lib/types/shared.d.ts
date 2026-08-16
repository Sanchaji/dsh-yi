/**
 * Shared wire types between the host command handler and the browser UI.
 * Keep this module dependency-free so both the Node bundle and the client
 * bundle can import it without dragging in the full 64-hexagram data table.
 */
export type DivinationTopic = 'career' | 'family' | 'project' | 'custom';
export type DivinationMethod = 'auto' | 'manual';
/** Coin-toss line values: 6 老阴, 7 少阳, 8 少阴, 9 老阳. */
export type LineValue = 6 | 7 | 8 | 9;
export interface DivinationLine {
    /** Line value from the bottom (index 0) to the top (index 5). */
    readonly value: LineValue;
    readonly label: '老阴' | '少阳' | '少阴' | '老阳';
    readonly yin: boolean;
    readonly changing: boolean;
}
export interface DivinationRequest {
    readonly topic: DivinationTopic;
    /** Required when topic is 'custom'. */
    readonly customText?: string;
    readonly method: DivinationMethod;
    /** Six line values from bottom to top; required when method is 'manual'. */
    readonly lines?: readonly LineValue[];
    /** Current DSH UI language, e.g. 'zh' or 'en'; used to shape the LLM reply language. */
    readonly language?: string;
}
export interface HexagramInfo {
    readonly number: number;
    readonly name: string;
    readonly upper: string;
    readonly lower: string;
    readonly binary: string;
    readonly judgment: string;
}
export interface DivinationResult {
    readonly question: string;
    readonly method: DivinationMethod;
    readonly lines: readonly DivinationLine[];
    readonly original: HexagramInfo;
    readonly changed?: HexagramInfo;
    readonly llmText: string;
}
export declare const DIVINATION_TOPIC_LABELS: Readonly<Record<DivinationTopic, string>>;
export declare function lineMeta(value: LineValue): DivinationLine;
export declare function questionText(topic: DivinationTopic, customText?: string): string;
