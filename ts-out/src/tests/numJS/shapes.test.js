"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('flatten', () => {
    expect((0, numJS_1.flatten)(1)).toBe(1);
    expect((0, numJS_1.flatten)([1, 2, 3])).toEqual([1, 2, 3]);
    expect((0, numJS_1.flatten)([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    expect((0, numJS_1.flatten)([
        [
            [1, 2],
            [3, 4]
        ],
        [
            [5, 6],
            [7, 8]
        ]
    ])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
test('full', () => {
    expect(() => (0, numJS_1.full)([])).toThrow(Error);
    expect((0, numJS_1.full)([], 0)).toBe(0);
    expect((0, numJS_1.full)([1], 1)).toEqual([1]);
    expect((0, numJS_1.full)([2, 3], 2)).toEqual([[2, 2, 2], [2, 2, 2]]);
    expect((0, numJS_1.full)([1, 2, 3], 3)).toEqual([
        [
            [3, 3, 3],
            [3, 3, 3]
        ]
    ]);
    expect((0, numJS_1.full)([2, 2], undefined, () => true)).toEqual([[true, true], [true, true]]);
});
test('getShape', () => {
    expect((0, numJS_1.getShape)(0)).toEqual([]);
    expect((0, numJS_1.getShape)([])).toEqual([0]);
    expect((0, numJS_1.getShape)([1])).toEqual([1]);
    expect((0, numJS_1.getShape)([1, 2, 3])).toEqual([3]);
    expect((0, numJS_1.getShape)([[1, 2, 3], [4, 5, 6]])).toEqual([2, 3]);
    expect((0, numJS_1.getShape)([
        [
            [1, 2, 3],
            [4, 5, 6]
        ],
        [
            [7, 8, 9],
            [10, 11, 12]
        ]
    ])).toEqual([2, 2, 3]);
});
test('reshape', () => {
    expect(() => (0, numJS_1.reshape)(5, [])).toThrow(Error);
    expect(() => (0, numJS_1.reshape)([1, 2], [])).toThrow(Error);
    expect(() => (0, numJS_1.reshape)([1, 2, 3, 4], [3])).toThrow(Error);
    expect((0, numJS_1.reshape)([1], [1])).toEqual([1]);
    expect((0, numJS_1.reshape)([1, 2, 3, 4], [2, 2])).toEqual([[1, 2], [3, 4]]);
    expect((0, numJS_1.reshape)([[1, 2], [3, 4]], [4])).toEqual([1, 2, 3, 4]);
    expect((0, numJS_1.reshape)([
        [
            [1, 2],
            [3, 4],
            [5, 6]
        ]
    ], [3, 2])).toEqual([
        [1, 2],
        [3, 4],
        [5, 6]
    ]);
    expect((0, numJS_1.reshape)([
        [1, 2],
        [3, 4],
        [5, 6]
    ], [1, 2, 3])).toEqual([
        [
            [1, 2, 3],
            [4, 5, 6]
        ]
    ]);
});
test('broadcasting', () => {
    expect(() => (0, numJS_1.addArrays)([0, 1, 2], [0, 1])).toThrow(Error);
    const a = (0, numJS_1.reshape)((0, numJS_1.arange)(24), [2, 3, 4]);
    const b = 5;
    const c = (0, numJS_1.addArrays)(a, b);
    const exp = (0, numJS_1.addArrays)(a, (0, numJS_1.full)((0, numJS_1.getShape)(a), b));
    const exp2 = (0, numJS_1.addArrays)((0, numJS_1.full)((0, numJS_1.getShape)(a), b), a);
    expect((0, numJS_1.getShape)(c)).toEqual((0, numJS_1.getShape)(a));
    expect((0, numJS_1.allEqual)(exp, c)).toBe(true);
    expect((0, numJS_1.allEqual)(exp, exp2)).toBe(true);
    const d = (0, numJS_1.addArrays)(b, a);
    expect((0, numJS_1.getShape)(d)).toEqual((0, numJS_1.getShape)(a));
    expect((0, numJS_1.allEqual)(exp, d)).toBe(true);
    const e = (0, random_1.randArr)([24], 2).map(n => !!n);
    let f = (0, numJS_1.reshape)(e, [2, 3, 4]);
    expect((0, numJS_1.all)((0, numJS_1.arrOr)(e, true))).toBe(true);
    expect((0, numJS_1.any)((0, numJS_1.arrAnd)(e, false))).toBe(false);
    expect((0, numJS_1.all)((0, numJS_1.arrOr)(true, e))).toBe(true);
    expect((0, numJS_1.any)((0, numJS_1.arrAnd)(false, e))).toBe(false);
    const ored = (0, numJS_1.arrOr)(e, f);
    expect((0, numJS_1.getShape)(ored)).toEqual((0, numJS_1.getShape)(f));
    expect((0, numJS_1.allEqual)(ored, f)).toBe(true);
    expect((0, numJS_1.allEqual)(ored, e)).toBe(true);
    expect((0, numJS_1.allEqual)(f, ored)).toBe(true);
    expect((0, numJS_1.allEqual)(ored, e)).toBe(true);
    const g = (0, numJS_1.reshape)(a, [2, 12]);
    const h = (0, numJS_1.subArrays)(a, g);
    expect((0, numJS_1.getShape)(h)).toEqual((0, numJS_1.getShape)(a));
    const i = (0, numJS_1.arange)(12);
    const j = (0, numJS_1.reshape)(i, [3, 4]);
    const k = (0, numJS_1.reshape)(i, [4, 3]);
    const l = (0, numJS_1.addArrays)(j, k);
    expect((0, numJS_1.getShape)(l)).toEqual((0, numJS_1.getShape)(j));
    expect((0, numJS_1.addArrays)(1, 2)).toBe(3);
    expect((0, numJS_1.addArrays)([1, 2, 3], [[1, 2, 3]])).toEqual([[2, 4, 6]]);
});
test('zeros and ones', () => {
    const arrs = [
        (0, numJS_1.zeros)([20]),
        (0, numJS_1.ones)([20])
    ];
    for (let i = 0; i < arrs.length; i++) {
        expect((0, numJS_1.all)((0, numJS_1.arrEqual)(arrs[i], i))).toBe(true);
        expect((0, numJS_1.getShape)(arrs[i])).toEqual([20]);
    }
});
test('getSize', () => {
    expect((0, numJS_1.getSize)(0)).toBe(1);
    expect((0, numJS_1.getSize)([])).toBe(0);
    expect((0, numJS_1.getSize)([1, 2, 3])).toBe(3);
    expect((0, numJS_1.getSize)([[1, 2], [3, 4]])).toBe(4);
    expect((0, numJS_1.getSize)([
        [
            [1, 2],
            [3, 4]
        ],
        [
            [5, 6],
            [7, 8]
        ],
        [
            [9, 10],
            [11, 12]
        ]
    ])).toBe(12);
});
