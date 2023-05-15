"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('median', () => {
    const a = [0, 1, 2];
    const b = [0, 1, 2, 3];
    const c = [[-2, -1], [1, 2]];
    for (let i = 0; i < 10; i++) {
        (0, random_1.shuffle)(a);
        expect((0, numJS_1.median)(a)).toBe(1);
        (0, random_1.shuffle)(b);
        expect((0, numJS_1.median)(b)).toBeCloseTo(1.5);
        (0, random_1.shuffle)(c);
        expect((0, numJS_1.median)(c)).toBe(0);
    }
    expect((0, numJS_1.median)(2)).toBe(2);
    expect(() => (0, numJS_1.median)([])).toThrowError();
});
test('mode', () => {
    const a = [0, 0, 1, 1, 1, 2];
    const b = [0, 0, 0, 1, 1, 2];
    const c = [[0, 1], [1, 2], [2, 2]];
    for (let i = 0; i < 10; i++) {
        (0, random_1.shuffle)(a);
        (0, random_1.shuffle)(b);
        (0, random_1.shuffle)(c);
        expect((0, numJS_1.mode)(a)).toBe(1);
        expect((0, numJS_1.mode)(b)).toBe(0);
        expect((0, numJS_1.mode)(c)).toBe(2);
    }
    expect((0, numJS_1.mode)(2)).toBe(2);
    expect(() => (0, numJS_1.mode)([])).toThrowError();
});
test('average', () => {
    expect((0, numJS_1.mean)([1, 2, 3, 4, 5])).toBe(3);
    expect((0, numJS_1.mean)([-3, -2, -1, 0, 1, 2, 3])).toBe(0);
    expect((0, numJS_1.mean)(1)).toBe(1);
    expect((0, numJS_1.mean)([[1, 2], [3, 4]])).toBeCloseTo(2.5);
    expect(() => (0, numJS_1.mean)([])).toThrowError();
});
