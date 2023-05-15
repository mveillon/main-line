"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notationIndices_1 = require("../../chessLogic/notationIndices");
const random_1 = require("../../utils/random");
test('letterToCol', () => {
    const cols = 'hgfedcba';
    for (let i = 0; i < cols.length; i++) {
        expect((0, notationIndices_1.letterToCol)(cols[i])).toBe(i);
        expect((0, notationIndices_1.indexToLetter)(i)).toBe(cols[i]);
    }
});
test('notationToIndices', () => {
    expect((0, notationIndices_1.notationToIndices)('h1')).toEqual([0, 0]);
    expect((0, notationIndices_1.notationToIndices)('a1')).toEqual([0, 7]);
    expect((0, notationIndices_1.notationToIndices)('h8')).toEqual([7, 0]);
    expect((0, notationIndices_1.notationToIndices)('a8')).toEqual([7, 7]);
    expect((0, notationIndices_1.notationToIndices)('e4')).toEqual([3, 3]);
    expect((0, notationIndices_1.notationToIndices)('d5')).toEqual([4, 4]);
});
test('indicesToNotation', () => {
    expect((0, notationIndices_1.indicesToNotation)(0, 0)).toBe('h1');
    expect((0, notationIndices_1.indicesToNotation)(0, 7)).toBe('a1');
    expect((0, notationIndices_1.indicesToNotation)(7, 0)).toBe('h8');
    expect((0, notationIndices_1.indicesToNotation)(7, 7)).toBe('a8');
    expect((0, notationIndices_1.indicesToNotation)(3, 3)).toBe('e4');
    expect((0, notationIndices_1.indicesToNotation)(4, 4)).toBe('d5');
});
test('randomIndices', () => {
    const iters = 32;
    const files = 'abcdefgh'.split('');
    for (let i = 0; i < iters; i++) {
        const square = (0, random_1.choice)(files) + (0, random_1.randInt)(1, 9).toString();
        expect((0, notationIndices_1.indicesToNotation)(...(0, notationIndices_1.notationToIndices)(square))).toBe(square);
    }
});
test('errors', () => {
    expect(() => (0, notationIndices_1.letterToCol)('`')).toThrow();
    expect(() => (0, notationIndices_1.letterToCol)('i')).toThrow();
    expect(() => (0, notationIndices_1.indexToLetter)(-1)).toThrow();
    expect(() => (0, notationIndices_1.indexToLetter)(8)).toThrow();
    expect(() => (0, notationIndices_1.notationToIndices)('h56')).toThrow();
    expect(() => (0, notationIndices_1.notationToIndices)('')).toThrow();
    expect(() => (0, notationIndices_1.indicesToNotation)(-1, 2)).toThrow();
    expect(() => (0, notationIndices_1.indicesToNotation)(8, 2)).toThrow();
});
