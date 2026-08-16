/**
 * King Wen sequence of the 64 I Ching hexagrams.
 * `lower` is the bottom trigram, `upper` is the top trigram.
 * Binary strings are derived in engine.ts from these trigrams.
 */
export interface HexagramRecord {
    readonly number: number;
    readonly name: string;
    readonly upper: string;
    readonly lower: string;
    readonly judgment: string;
}
export declare const HEXAGRAMS: readonly HexagramRecord[];
