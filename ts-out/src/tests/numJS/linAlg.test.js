"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const A = [[1, 2], [3, 4]];
const I = [[1, 0], [0, 1]];
test('transpose', () => {
    expect((0, numJS_1.transpose)(A)).toEqual([[1, 3], [2, 4]]);
    expect((0, numJS_1.transpose)([[1, 2, 3, 4]])).toEqual([[1], [2], [3], [4]]);
    expect((0, numJS_1.transpose)([[1, 2, 3], [4, 5, 6]])).toEqual([[1, 4], [2, 5], [3, 6]]);
    expect((0, numJS_1.transpose)((0, numJS_1.transpose)([[1, 2], [3, 4], [5, 6]]))).toEqual([[1, 2], [3, 4], [5, 6]]);
});
test('matMul', () => {
    expect((0, numJS_1.matMul)(2, 3)).toBe(6);
    expect((0, numJS_1.matMul)(5, A)).toEqual([[5, 10], [15, 20]]);
    expect((0, numJS_1.matMul)(A, 5)).toEqual([[5, 10], [15, 20]]);
    expect((0, numJS_1.matMul)(5, [1, 2, 3, 4])).toEqual([5, 10, 15, 20]);
    expect((0, numJS_1.matMul)([1, 2, 3, 4], 5)).toEqual([5, 10, 15, 20]);
    expect((0, numJS_1.matMul)([1, 2, 3], [4, 5, 6])).toBe(32);
    expect((0, numJS_1.matMul)(A, I)).toEqual(A);
    expect((0, numJS_1.matMul)(I, A)).toEqual(A);
    expect((0, numJS_1.matMul)(A, [5, 6])).toEqual([17, 39]);
    expect((0, numJS_1.matMul)([5, 6], A)).toEqual([23, 34]);
    expect(() => (0, numJS_1.matMul)(A, [[1, 2], [3, 4], [5, 6]])).toThrowError();
});
test('invert', () => {
    expect(() => (0, numJS_1.invert)([[1, 2]])).toThrowError();
    expect(() => (0, numJS_1.invert)([[1, 0], [0, 0]])).toThrowError();
    const i = (0, numJS_1.invert)(A);
    expect((0, numJS_1.getShape)(i)).toEqual((0, numJS_1.getShape)(A));
    expect((0, numJS_1.allClose)(i, [[-2, 1], [1.5, -0.5]])).toBe(true);
    const i2 = (0, numJS_1.invert)(I);
    expect((0, numJS_1.getShape)(i2)).toEqual((0, numJS_1.getShape)(I));
    expect((0, numJS_1.allClose)(i2, I)).toBe(true);
});
test('eye', () => {
    expect((0, numJS_1.eye)(1)).toEqual([[1]]);
    expect((0, numJS_1.eye)(2)).toEqual([[1, 0], [0, 1]]);
    expect((0, numJS_1.eye)(3)).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
});
