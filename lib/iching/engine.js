/**
 * I Ching engine: coin toss → six lines → original/changed hexagram lookup.
 * Pure functions only; randomness is injected by callers so tests can be deterministic.
 */
import { HEXAGRAMS } from "./data.js";
import { lineMeta } from "../shared.js";
const TRIGRAM_BITS = {
    '乾': [1, 1, 1],
    '兑': [1, 1, 0],
    '离': [1, 0, 1],
    '震': [1, 0, 0],
    '巽': [0, 1, 1],
    '坎': [0, 1, 0],
    '艮': [0, 0, 1],
    '坤': [0, 0, 0],
};
const HEXAGRAM_BY_BINARY = new Map(HEXAGRAMS.map(hexagram => [binaryOf(hexagram), hexagram]));
/** Build a bottom-to-top six-bit binary string from a hexagram record. */
export function binaryOf(hexagram) {
    const lower = TRIGRAM_BITS[hexagram.lower];
    const upper = TRIGRAM_BITS[hexagram.upper];
    if (lower === undefined || upper === undefined) {
        throw new Error(`unknown trigram in hexagram ${hexagram.number}: ${hexagram.lower}/${hexagram.upper}`);
    }
    return [...lower, ...upper].join('');
}
/** Toss three coins; each coin is 2 (tails) or 3 (heads). */
export function tossThreeCoins(random = Math.random) {
    return [0, 1, 2].map(() => (random() < 0.5 ? 2 : 3));
}
/** Convert one three-coin toss into a line value. */
export function lineFromCoins(coins) {
    if (coins.length !== 3)
        throw new Error('a line requires exactly three coins');
    const sum = coins.reduce((total, coin) => total + coin, 0);
    if (sum === 6 || sum === 7 || sum === 8 || sum === 9)
        return sum;
    throw new Error(`invalid coin sum: ${sum}`);
}
/** Build six lines from bottom to top using the provided random source. */
export function castLines(random = Math.random) {
    return Array.from({ length: 6 }, () => lineMeta(lineFromCoins(tossThreeCoins(random))));
}
/** Validate and decorate six user-supplied line values. */
export function linesFromValues(values) {
    if (values.length !== 6) {
        throw new Error(`manual divination requires exactly 6 lines, got ${values.length}`);
    }
    return values.map(value => lineMeta(value));
}
/** Bottom-to-top binary string for a set of lines (yin = 0, yang = 1). */
export function binaryFromLines(lines) {
    return lines.map(line => (line.yin ? '0' : '1')).join('');
}
/** Look up the King Wen hexagram for a binary string. */
export function hexagramByBinary(binary) {
    const hexagram = HEXAGRAM_BY_BINARY.get(binary);
    if (hexagram === undefined)
        throw new Error(`unknown hexagram binary: ${binary}`);
    return hexagram;
}
/** Build the changed hexagram when any line is old yin/old yang. */
export function changedHexagram(lines) {
    if (!lines.some(line => line.changing))
        return undefined;
    const changedBits = lines.map(line => (line.changing ? (line.yin ? '1' : '0') : (line.yin ? '0' : '1'))).join('');
    return hexagramByBinary(changedBits);
}
/** Convert a record to the wire-safe hexagram info shape. */
export function toHexagramInfo(hexagram) {
    return {
        number: hexagram.number,
        name: hexagram.name,
        upper: hexagram.upper,
        lower: hexagram.lower,
        binary: binaryOf(hexagram),
        judgment: hexagram.judgment,
    };
}
//# sourceMappingURL=engine.js.map