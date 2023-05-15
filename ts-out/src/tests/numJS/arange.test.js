"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
test('arange', () => {
    expect((0, numJS_1.arange)(0, 5, 1)).toEqual([0, 1, 2, 3, 4]);
    expect((0, numJS_1.arange)(5)).toEqual([0, 1, 2, 3, 4]);
    expect((0, numJS_1.arange)(-5, 0)).toEqual([-5, -4, -3, -2, -1]);
    expect((0, numJS_1.arange)(0, -5, -1)).toEqual([0, -1, -2, -3, -4]);
    expect((0, numJS_1.allClose)((0, numJS_1.arange)(0, 2, 0.5), [0, 0.5, 1, 1.5])).toBe(true);
    expect((0, numJS_1.allClose)((0, numJS_1.arange)(2, 0, -0.5), [2, 1.5, 1, 0.5])).toBe(true);
    expect(() => (0, numJS_1.arange)(0, -5)).toThrow();
});
