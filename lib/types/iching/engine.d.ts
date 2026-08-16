/**
 * I Ching engine: coin toss → six lines → original/changed hexagram lookup.
 * Pure functions only; randomness is injected by callers so tests can be deterministic.
 */
import { type HexagramRecord } from './data.ts';
import { type DivinationLine, type HexagramInfo, type LineValue } from '../shared.ts';
/** Build a bottom-to-top six-bit binary string from a hexagram record. */
export declare function binaryOf(hexagram: HexagramRecord): string;
/** Toss three coins; each coin is 2 (tails) or 3 (heads). */
export declare function tossThreeCoins(random?: () => number): number[];
/** Convert one three-coin toss into a line value. */
export declare function lineFromCoins(coins: readonly number[]): LineValue;
/** Build six lines from bottom to top using the provided random source. */
export declare function castLines(random?: () => number): DivinationLine[];
/** Validate and decorate six user-supplied line values. */
export declare function linesFromValues(values: readonly LineValue[]): DivinationLine[];
/** Bottom-to-top binary string for a set of lines (yin = 0, yang = 1). */
export declare function binaryFromLines(lines: readonly DivinationLine[]): string;
/** Look up the King Wen hexagram for a binary string. */
export declare function hexagramByBinary(binary: string): HexagramRecord;
/** Build the changed hexagram when any line is old yin/old yang. */
export declare function changedHexagram(lines: readonly DivinationLine[]): HexagramRecord | undefined;
/** Convert a record to the wire-safe hexagram info shape. */
export declare function toHexagramInfo(hexagram: HexagramRecord): HexagramInfo;
