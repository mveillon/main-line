"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
test('add arrays', () => {
    expect((0, numJS_1.addArrays)(1, 2)).toBe(3);
    expect((0, numJS_1.addArrays)([1], [2])).toEqual([3]);
    expect((0, numJS_1.addArrays)([[1, 2], [3, 4]], [[4, 5], [6, 7]])).toEqual([[5, 7], [9, 11]]);
    expect((0, numJS_1.addArrays)([
        [
            [1, 2],
            [3, 4]
        ],
        [
            [5, 6],
            [7, 8]
        ]
    ], [
        [
            [9, 10],
            [11, 12]
        ],
        [
            [13, 14],
            [15, 16]
        ]
    ])).toEqual([
        [
            [10, 12],
            [14, 16]
        ],
        [
            [18, 20],
            [22, 24]
        ]
    ]);
});
test('sub arrays', () => {
    expect((0, numJS_1.subArrays)(1, 2)).toBe(-1);
    expect((0, numJS_1.subArrays)(2, 1)).toBe(1);
    expect((0, numJS_1.subArrays)([1], [2])).toEqual([-1]);
    expect((0, numJS_1.subArrays)([[1, 2], [3, 4]], [[4, 5], [6, 7]])).toEqual([[-3, -3], [-3, -3]]);
    expect((0, numJS_1.subArrays)([
        [
            [1, 2],
            [3, 4]
        ],
        [
            [5, 6],
            [7, 8]
        ]
    ], [
        [
            [9, 10],
            [11, 12]
        ],
        [
            [13, 14],
            [15, 16]
        ]
    ])).toEqual([
        [
            [-8, -8],
            [-8, -8]
        ],
        [
            [-8, -8],
            [-8, -8]
        ]
    ]);
});
test('scalar mul', () => {
    expect((0, numJS_1.scalarMul)(1, 2)).toBe(2);
    expect((0, numJS_1.scalarMul)([3], 2)).toEqual([6]);
    expect((0, numJS_1.scalarMul)([[1, 2], [3, 4]], -1)).toEqual([[-1, -2], [-3, -4]]);
});
test('colAverage', () => {
    expect((0, numJS_1.colAverage)([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ])).toEqual([4, 5, 6]);
    expect((0, numJS_1.colAverage)([[1, 2, 3]])).toEqual([1, 2, 3]);
    const avgs = (0, numJS_1.colAverage)([
        [1, 2, 3, 4],
        [6, 5, 4, 3],
        [7, 8, 9, 10]
    ]);
    const trueVals = [14 / 3, 15 / 3, 16 / 3, 17 / 3];
    expect(avgs.length).toBe(trueVals.length);
    for (let i = 0; i < avgs.length; i++) {
        expect(avgs[i]).toBeCloseTo(trueVals[i]);
    }
    expect((0, numJS_1.colAverage)([])).toEqual([]);
});
test('sumList', () => {
    expect((0, numJS_1.sumList)(1)).toBe(1);
    expect((0, numJS_1.sumList)([1, 2, 3])).toBe(6);
    expect((0, numJS_1.sumList)([
        [1, 2, 3],
        [4, 5, 6]
    ])).toBe(21);
    expect((0, numJS_1.sumList)([
        [
            [1, 2, 3],
            [4, 5, 6]
        ],
        [
            [7, 8, 9],
        ]
    ])).toBe(45);
});
