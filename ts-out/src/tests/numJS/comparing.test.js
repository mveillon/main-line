"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('isClose', () => {
    const eps = 1e-10;
    expect((0, numJS_1.isClose)(0, 0)).toBe(true);
    expect((0, numJS_1.isClose)(1, 0)).toBe(false);
    expect((0, numJS_1.isClose)(0, eps)).toBe(true);
    expect((0, numJS_1.isClose)(0, 0.1)).toBe(false);
    expect((0, numJS_1.isClose)([1, 2, 3], [1, 2, 3])).toEqual([true, true, true]);
    expect((0, numJS_1.isClose)([1, 2, 3], [1 + eps, 2 - eps, 3 + eps])).toEqual([true, true, true]);
    expect((0, numJS_1.isClose)([1, 2, 3], [1 - eps, 2 + eps, 4])).toEqual([true, true, false]);
    expect((0, numJS_1.isClose)([1, 2, 3], [4, 5, 6])).toEqual([false, false, false]);
    expect((0, numJS_1.isClose)([
        [1, 2, 3],
        [4, 5, 6]
    ], [
        [1 + eps, 2 - eps, 3 + eps],
        [4 - eps, 5 + eps, 6 - eps]
    ])).toEqual([
        [true, true, true],
        [true, true, true]
    ]);
    expect((0, numJS_1.isClose)([
        [1, 2, 3],
        [4, 5, 6]
    ], [
        [1 + eps, 3 - eps, 3 + eps],
        [4 - eps, 5 + eps, 7 - eps]
    ])).toEqual([
        [true, false, true],
        [true, true, false]
    ]);
    expect((0, numJS_1.allClose)([
        [1, 2, 3],
        [4, 5, 6]
    ], [
        [1 + eps, 2 - eps, 3 + eps],
        [4 - eps, 5 + eps, 6 - eps]
    ])).toBe(true);
    expect((0, numJS_1.allClose)([
        [1, 2, 3],
        [4, 5, 6]
    ], [
        [1 + eps, 3 - eps, 3 + eps],
        [4 - eps, 5 + eps, 7 - eps]
    ])).toBe(false);
});
test('array comparing', () => {
    const a = (0, random_1.randArr)([24], 24);
    const b = (0, random_1.randArr)([24], 24);
    expect((0, numJS_1.getShape)(a)).toEqual((0, numJS_1.getShape)(b));
    const fs = [
        {
            arr: numJS_1.arrEqual,
            c: (x, y) => x === y
        },
        {
            arr: numJS_1.arrLT,
            c: (x, y) => x < y
        },
        {
            arr: numJS_1.arrGT,
            c: (x, y) => x > y
        },
        {
            arr: numJS_1.arrLTEq,
            c: (x, y) => x <= y
        },
        {
            arr: numJS_1.arrGTEq,
            c: (x, y) => x >= y
        },
    ];
    for (const pair of fs) {
        const compared = pair.arr(a, b);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a));
        for (let i = 0; i < compared.length; i++) {
            expect(compared[i]).toBe(pair.c(a[i], b[i]));
        }
    }
    const a2d = (0, numJS_1.reshape)(a, [6, 4]);
    const b2d = (0, numJS_1.reshape)(b, [6, 4]);
    expect((0, numJS_1.getShape)(a2d)).toEqual((0, numJS_1.getShape)(b2d));
    for (const pair of fs) {
        const compared = pair.arr(a2d, b2d);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a2d));
        for (let i = 0; i < compared.length; i++) {
            for (let j = 0; j < compared[i].length; j++) {
                expect(compared[i][j]).toBe(pair.c(a2d[i][j], b2d[i][j]));
            }
        }
    }
    const a3d = (0, numJS_1.reshape)(a, [2, 3, 4]);
    const b3d = (0, numJS_1.reshape)(b, [2, 3, 4]);
    expect((0, numJS_1.getShape)(a3d)).toEqual((0, numJS_1.getShape)(b3d));
    for (const pair of fs) {
        const compared = pair.arr(a3d, b3d);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a3d));
        for (let i = 0; i < compared.length; i++) {
            for (let j = 0; j < compared[i].length; j++) {
                for (let k = 0; k < compared[i][j].length; k++) {
                    expect(compared[i][j][k]).toBe(pair.c(a3d[i][j][k], b3d[i][j][k]));
                }
            }
        }
    }
});
test('array boolean compares', () => {
    const a = (0, random_1.randArr)([24], 2).map(n => !!n);
    const b = (0, random_1.randArr)([24], 2).map(n => !!n);
    expect((0, numJS_1.getShape)(a)).toEqual((0, numJS_1.getShape)(b));
    const fs = [
        {
            arr: numJS_1.arrOr,
            c: (x, y) => x || y
        },
        {
            arr: numJS_1.arrAnd,
            c: (x, y) => x && y
        }
    ];
    for (const pair of fs) {
        const compared = pair.arr(a, b);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a));
        for (let i = 0; i < compared.length; i++) {
            expect(compared[i]).toBe(pair.c(a[i], b[i]));
        }
    }
    const notted = (0, numJS_1.arrNot)(a);
    expect((0, numJS_1.getShape)(notted)).toEqual((0, numJS_1.getShape)(a));
    expect((0, numJS_1.any)((0, numJS_1.arrEqual)(a, notted))).toBe(false);
    const a2d = (0, numJS_1.reshape)(a, [6, 4]);
    const b2d = (0, numJS_1.reshape)(b, [6, 4]);
    expect((0, numJS_1.getShape)(a2d)).toEqual((0, numJS_1.getShape)(b2d));
    for (const pair of fs) {
        const compared = pair.arr(a2d, b2d);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a2d));
        for (let i = 0; i < compared.length; i++) {
            for (let j = 0; j < compared[i].length; j++) {
                expect(compared[i][j]).toBe(pair.c(a2d[i][j], b2d[i][j]));
            }
        }
    }
    const not2d = (0, numJS_1.arrNot)(a2d);
    expect((0, numJS_1.getShape)(not2d)).toEqual((0, numJS_1.getShape)(a2d));
    expect((0, numJS_1.any)((0, numJS_1.arrEqual)(a2d, not2d))).toBe(false);
    const a3d = (0, numJS_1.reshape)(a, [2, 3, 4]);
    const b3d = (0, numJS_1.reshape)(b, [2, 3, 4]);
    expect((0, numJS_1.getShape)(a3d)).toEqual((0, numJS_1.getShape)(b3d));
    for (const pair of fs) {
        const compared = pair.arr(a3d, b3d);
        expect((0, numJS_1.getShape)(compared)).toEqual((0, numJS_1.getShape)(a3d));
        for (let i = 0; i < compared.length; i++) {
            for (let j = 0; j < compared[i].length; j++) {
                for (let k = 0; k < compared[i][j].length; k++) {
                    expect(compared[i][j][k]).toBe(pair.c(a3d[i][j][k], b3d[i][j][k]));
                }
            }
        }
    }
    const not3d = (0, numJS_1.arrNot)(a3d);
    expect((0, numJS_1.getShape)(not3d)).toEqual((0, numJS_1.getShape)(a3d));
    expect((0, numJS_1.any)((0, numJS_1.arrEqual)(a3d, not3d))).toBe(false);
});
test('array equality', () => {
    expect((0, numJS_1.sameArr)([1, 2, 3], [1, 2, 3])).toBe(true);
    expect((0, numJS_1.sameArr)([1, 2, 3], [[1, 2, 3]])).toBe(false);
    expect((0, numJS_1.allEqual)([1, 2, 3], [1, 2, 3])).toBe(true);
    expect((0, numJS_1.allEqual)([1, 2, 3], [[1, 2, 3]])).toBe(true);
    expect((0, numJS_1.allEqual)([1, 2, 3], [[1, 2, 4]])).toBe(false);
});
