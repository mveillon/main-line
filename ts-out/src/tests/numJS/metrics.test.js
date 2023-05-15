"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
test('mse', () => {
    expect((0, numJS_1.mse)(1, 2)).toBe(1);
    expect((0, numJS_1.mse)([1, 1, 1], [1, 1, 1])).toBe(0);
    expect((0, numJS_1.mse)([1, 2, 3], [4, 5, 6])).toBe(9);
    expect((0, numJS_1.mse)([4, 5, 6], [1, 2, 3])).toBe(9);
    expect((0, numJS_1.mse)([1, 2, 3], [1, 2, 3])).toBe(0);
    expect((0, numJS_1.mse)([1, 2, 3], [1, 2, 3])).toBe(0);
    expect((0, numJS_1.mse)([], [])).toBe(0);
    expect((0, numJS_1.mse)([1, 2, 3], 1)).toBeCloseTo(5 / 3);
    expect((0, numJS_1.mse)([[1, 2], [3, 4]], 2)).toBeCloseTo(1.5);
});
test('square distance', () => {
    expect((0, numJS_1.squareDistance)(1, 3)).toBe(4);
    expect((0, numJS_1.squareDistance)([1, 2, 3], 1)).toBe(5);
    expect((0, numJS_1.squareDistance)([3], [4])).toBe(1);
    expect((0, numJS_1.squareDistance)([1, 2], [4, 6])).toBe(25);
    expect((0, numJS_1.squareDistance)([1, 2, 3], [4, 5, 6])).toBe(27);
    expect((0, numJS_1.squareDistance)([4, 5, 6], [1, 2, 3])).toBe(27);
    expect((0, numJS_1.squareDistance)([], [])).toBe(0);
    expect((0, numJS_1.squareDistance)([[1, 2], [3, 4]], 2)).toBe(6);
});
test('manhattan', () => {
    expect((0, numJS_1.manhattanDistance)([1, 2, 3], [4, 5, 6])).toBe(9);
    expect((0, numJS_1.manhattanDistance)([4, 5, 6], [1, 2, 3])).toBe(9);
    expect((0, numJS_1.manhattanDistance)([1, 2, 3], [4, 5, 6])).toBe(9);
    expect((0, numJS_1.manhattanDistance)([4, 5, 6], [1, 2, 3])).toBe(9);
    expect((0, numJS_1.manhattanDistance)([], [])).toBe(0);
    expect((0, numJS_1.manhattanDistance)(1, 2)).toBe(1);
    expect((0, numJS_1.manhattanDistance)([1, 2, 3], 1)).toBe(3);
    expect((0, numJS_1.manhattanDistance)([[1, 2], [3, 4]], 2)).toBe(4);
});
test('magnitude', () => {
    expect((0, numJS_1.squaredMag)([3, 4])).toBe(25);
    expect((0, numJS_1.squaredMag)([5, 12])).toBe(169);
    expect((0, numJS_1.squaredMag)([12, 5])).toBe(169);
    expect((0, numJS_1.squaredMag)([1, 2, 3, 4])).toBe(30);
    expect((0, numJS_1.squaredMag)([])).toBe(0);
    expect((0, numJS_1.squaredMag)(2)).toBe(4);
    expect((0, numJS_1.squaredMag)([[1, 2], [3, 4]])).toBe(30);
});
test('dot', () => {
    expect((0, numJS_1.dot)([1, 2, 3, 4], [5, 6, 7, 8])).toBe(70);
    expect((0, numJS_1.dot)([1], [2, 3, 4])).toBe(2);
    expect((0, numJS_1.dot)([2, 3, 4], [1])).toBe(2);
});
test('variance', () => {
    expect((0, numJS_1.variance)([1, 1, 1, 1])).toBe(0);
    expect((0, numJS_1.variance)([0, 1, 1, 2])).toBeCloseTo(2 / 3);
    expect((0, numJS_1.variance)([[2, 2], [2, 2]])).toBe(0);
    expect((0, numJS_1.variance)([1, 2, 3])).toBeCloseTo(1);
});
test('sigmoid', () => {
    const s = (0, numJS_1.arange)(100).map(numJS_1.sigmoid);
    for (let i = 1; i < s.length; i++) {
        expect(s[i]).toBeGreaterThanOrEqual(0);
        expect(s[i]).toBeLessThanOrEqual(1);
        expect(s[i]).toBeGreaterThanOrEqual(s[i - 1]);
    }
});
test('correlation', () => {
    expect((0, numJS_1.correlation)([1, 2, 3], [4, 5, 6])).toBeCloseTo(1);
    expect((0, numJS_1.correlation)([1, 2, 3], [-1, -2, -3])).toBeCloseTo(-1);
    expect((0, numJS_1.correlation)([0, 1], [1, 2])).toBeCloseTo(1);
    expect((0, numJS_1.correlation)([0, 1], [1, 2])).toBeCloseTo(1);
    expect((0, numJS_1.correlation)([1, 2, 3], [4, 3, 4])).toBeCloseTo(0);
    expect((0, numJS_1.correlation)([1, 2, 3], [1, 1, 1])).toBeCloseTo(0);
    expect((0, numJS_1.correlation)([1, 2, 3], 1)).toBe(0);
    expect((0, numJS_1.correlation)([[1, 2], [3, 4]], [-1, -2, -3, -4])).toBe(-1);
});
test('col variance', () => {
    expect((0, numJS_1.allClose)((0, numJS_1.colVariance)([
        [0, 1, 2],
        [0, 2, 1],
        [0, 1, 1],
        [0, 2, 2]
    ]), [0, 1 / 3, 1 / 3])).toBe(true);
});
