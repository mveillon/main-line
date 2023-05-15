"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('ndMap', () => {
    const square = (n) => Math.pow(n, 2);
    expect((0, numJS_1.ndMap)(2, square)).toBe(4);
    expect((0, numJS_1.ndMap)([1, 2, 3], square)).toEqual([1, 4, 9]);
    expect((0, numJS_1.ndMap)([
        [1, 2, 3],
        [4, 5, 6]
    ], square)).toEqual([
        [1, 4, 9],
        [16, 25, 36]
    ]);
    const isZero = (n) => !n;
    expect((0, numJS_1.ndMap)([[0, 1, 2]], isZero)).toEqual([[true, false, false]]);
});
test('converting', () => {
    expect((0, numJS_1.toNum)(true)).toBe(1);
    expect((0, numJS_1.toNum)(false)).toBe(0);
    expect((0, numJS_1.toNum)([true, false, true])).toEqual([1, 0, 1]);
    expect((0, numJS_1.toNum)([[true, false], [false, true]])).toEqual([[1, 0], [0, 1]]);
    expect((0, numJS_1.toNum)([
        [
            [true, false],
            [true, false]
        ],
        [
            [false, true],
            [false, false, false]
        ],
        [
            [true, true, true],
            [false]
        ]
    ])).toEqual([
        [
            [1, 0],
            [1, 0]
        ],
        [
            [0, 1],
            [0, 0, 0]
        ],
        [
            [1, 1, 1],
            [0]
        ]
    ]);
    expect((0, numJS_1.toBool)(0)).toBe(false);
    expect((0, numJS_1.toBool)(1)).toBe(true);
    expect((0, numJS_1.toBool)([0, 1, 1])).toEqual([false, true, true]);
    expect((0, numJS_1.toBool)([[0, 1], [1, 0]])).toEqual([[false, true], [true, false]]);
    expect((0, numJS_1.toBool)([
        [
            [1, 0],
            [1, 0]
        ],
        [
            [0, 1],
            [0, 0, 0]
        ],
        [
            [1, 1, 1],
            [0]
        ]
    ])).toEqual([
        [
            [true, false],
            [true, false]
        ],
        [
            [false, true],
            [false, false, false]
        ],
        [
            [true, true, true],
            [false]
        ]
    ]);
    expect((0, numJS_1.any)((0, numJS_1.toBool)((0, numJS_1.zeros)([10])))).toBe(false);
    expect((0, numJS_1.all)((0, numJS_1.toBool)((0, numJS_1.ones)([10])))).toBe(true);
    expect((0, numJS_1.sumList)((0, numJS_1.toNum)((0, numJS_1.arrEqual)((0, numJS_1.zeros)([10]), 0)))).toBe(10);
    expect((0, numJS_1.sumList)((0, numJS_1.toNum)((0, numJS_1.arrEqual)((0, numJS_1.ones)([10]), 0)))).toBe(0);
    for (let i = 0; i < 10; i++) {
        const a = (0, random_1.randArr)([10, i + 1], 2);
        expect((0, numJS_1.toNum)((0, numJS_1.toBool)(a))).toEqual(a);
    }
});
