"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('array indexing', () => {
    expect(() => (0, numJS_1.arrIndex)(5, [0])).toThrow(Error);
    expect(() => (0, numJS_1.arrIndex)([1, 2, 3], [[0, 1]])).toThrow(Error);
    expect(() => (0, numJS_1.arrIndex)([1, 2, 3], [[[0, 1]]])).toThrow(Error);
    const arr = (0, random_1.randArr)([24], 10);
    expect((0, numJS_1.arrIndex)(arr, 0)).toBe(arr[0]);
    const numInds = (0, random_1.randArr)([10], arr.length);
    const boolInds = (0, random_1.randArr)([arr.length], 2).map(n => !!n);
    const arrNum = (0, numJS_1.arrIndex)(arr, numInds);
    for (let i = 0; i < arrNum.length; i++) {
        expect(arrNum[i]).toBe(arr[numInds[i]]);
    }
    const arrBool = (0, numJS_1.arrIndex)(arr, boolInds);
    expect(arrBool.length).toBe((0, numJS_1.sumList)(boolInds.map(b => +b)));
    let next = 0;
    for (let i = 0; i < boolInds.length; i++) {
        if (boolInds[i]) {
            expect(arrBool[next++]).toBe(arr[i]);
        }
    }
    const a2d = (0, numJS_1.reshape)(arr, [6, 4]);
    const aBool2d = (0, numJS_1.arrIndex)(a2d, boolInds);
    const numInds2d = (0, random_1.randArr)([10, 2], 4);
    const aNum2d = (0, numJS_1.arrIndex)(a2d, numInds2d);
    for (let i = 0; i < numInds2d.length; i++) {
        expect(aNum2d[i]).toBe(a2d[numInds2d[i][0]][numInds2d[i][1]]);
    }
    expect((0, numJS_1.getShape)(aBool2d).length).toBe(2);
    let nextI = 0;
    for (let i = 0; i < a2d.length; i++) {
        let nextJ = 0;
        for (let j = 0; j < a2d[i].length; j++) {
            if (boolInds[j + i * a2d[i].length]) {
                expect(aBool2d[nextI][nextJ++]).toBe(a2d[i][j]);
            }
        }
        nextI += +!!nextJ;
    }
    const smallNumInds = (0, random_1.randArr)([10], a2d.length);
    const aNum1d = (0, numJS_1.arrIndex)(a2d, smallNumInds);
    expect((0, numJS_1.getShape)(aNum1d)).toEqual([smallNumInds.length, a2d[0].length]);
    for (let i = 0; i < aNum1d.length; i++) {
        expect(aNum1d[i]).toEqual(a2d[smallNumInds[i]]);
    }
});
