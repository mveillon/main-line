"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
test('any and all', () => {
    expect((0, numJS_1.all)(false)).toBe(false);
    expect((0, numJS_1.all)(true)).toBe(true);
    expect((0, numJS_1.all)([])).toBe(false);
    expect((0, numJS_1.all)([false, true, true])).toBe(false);
    expect((0, numJS_1.all)([true, true, false])).toBe(false);
    expect((0, numJS_1.all)([true, true, true])).toBe(true);
    expect((0, numJS_1.all)([
        [true, true, true],
        [false, true, false]
    ])).toBe(false);
    expect((0, numJS_1.all)([
        [true, true, true],
        [true, true, true]
    ])).toBe(true);
    expect((0, numJS_1.all)([
        [
            [true, true, true],
            [false, true, true]
        ],
        [
            [true, true]
        ]
    ])).toBe(false);
    expect((0, numJS_1.all)([
        [
            [true, true, true],
            [true, true, true]
        ],
        [
            [true, true]
        ]
    ])).toBe(true);
    expect((0, numJS_1.any)(false)).toBe(false);
    expect((0, numJS_1.any)(true)).toBe(true);
    expect((0, numJS_1.any)([])).toBe(false);
    expect((0, numJS_1.any)([false, true, true])).toBe(true);
    expect((0, numJS_1.any)([true, true, false])).toBe(true);
    expect((0, numJS_1.any)([false, false, false])).toBe(false);
    expect((0, numJS_1.any)([
        [true, true, true],
        [false, true, false]
    ])).toBe(true);
    expect((0, numJS_1.any)([
        [false, false, false],
        [false, false, false]
    ])).toBe(false);
    expect((0, numJS_1.any)([
        [
            [true, true, true],
            [false, true, true]
        ],
        [
            [true, true]
        ]
    ])).toBe(true);
    expect((0, numJS_1.any)([
        [
            [false, false, false],
            [false, false, false]
        ],
        [
            [false, false]
        ]
    ])).toBe(false);
});
