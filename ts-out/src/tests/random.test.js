"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("../utils/random");
const numJS_1 = require("../utils/numJS");
const randIters = 5000;
test('randInt', () => {
    let dists = (0, numJS_1.zeros)([10]);
    for (let i = 0; i < randIters; i++) {
        const rand = (0, random_1.randInt)(dists.length);
        expect(Number.isInteger(rand)).toBe(true);
        expect(rand).toBeGreaterThanOrEqual(0);
        expect(rand).toBeLessThan(dists.length);
        dists[rand]++;
    }
    expect((0, numJS_1.allClose)(dists, (0, numJS_1.full)([dists.length], randIters / dists.length), 0.3));
});
test('choice', () => {
    expect(() => (0, random_1.choice)([], [])).toThrow(Error);
    expect(() => (0, random_1.choice)([1], [])).toThrow(Error);
    expect(() => (0, random_1.choice)([1, 2, 3], [-1, 2, 3])).toThrow(Error);
    expect(() => (0, random_1.choice)([1, 2, 3], [1, 0, 2])).toThrow(Error);
    let dists = (0, numJS_1.zeros)([10]);
    let wDists = (0, numJS_1.zeros)([dists.length]);
    let fwDists = (0, numJS_1.zeros)([dists.length]);
    const vals = (0, numJS_1.arange)(dists.length);
    const ws = vals.map(n => Math.pow(n, 2));
    const floatWs = (0, numJS_1.scalarMul)(ws, 1 / (0, numJS_1.sumList)(ws));
    const checkN = (n) => {
        expect(Number.isInteger(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(vals[0]);
        expect(n).toBeLessThanOrEqual(vals[vals.length - 1]);
    };
    for (let i = 0; i < randIters; i++) {
        const v = (0, random_1.choice)(vals);
        checkN(v);
        dists[v]++;
        const w = (0, random_1.choice)(vals, ws);
        checkN(w);
        wDists[w]++;
        const fw = (0, random_1.choice)(vals, floatWs);
        checkN(fw);
        fwDists[fw]++;
    }
    expect((0, numJS_1.allClose)(dists, (0, numJS_1.full)([dists.length], randIters / dists.length), 0.3)).toBe(true);
    expect((0, numJS_1.allClose)((0, numJS_1.scalarMul)(wDists, 1 / randIters), floatWs, undefined, randIters / 100)).toBe(true);
    expect((0, numJS_1.allClose)((0, numJS_1.scalarMul)(fwDists, 1 / randIters), floatWs, undefined, randIters / 100));
});
test('shuffle', () => {
    let inds = (0, numJS_1.zeros)([10]);
    let vals = (0, numJS_1.arange)(inds.length);
    for (let i = 0; i < randIters; i++) {
        (0, random_1.shuffle)(vals);
        inds[vals.indexOf(0)]++;
    }
    expect((0, numJS_1.allClose)(inds, (0, numJS_1.full)([inds.length], randIters / inds.length), 0.3)).toBe(true);
});
test('rand array', () => {
    const a = (0, random_1.randArr)([], 2);
    expect(typeof a).toBe('number');
    expect(Number.isInteger(a)).toBe(true);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(2);
    const b = (0, random_1.randArr)([], 1, 3);
    expect(typeof b).toBe('number');
    expect(Number.isInteger(b)).toBe(true);
    expect(b).toBeGreaterThanOrEqual(1);
    expect(b).toBeLessThan(3);
    const c = (0, random_1.randArr)([10], 10);
    expect((0, numJS_1.getShape)(c)).toEqual([10]);
    expect((0, numJS_1.all)((0, numJS_1.arrGTEq)(c, 0))).toBe(true);
    expect((0, numJS_1.all)((0, numJS_1.arrLT)(c, 10))).toBe(true);
    const d = (0, random_1.randArr)([2, 3, 4], 5, 10);
    expect((0, numJS_1.getShape)(d)).toEqual([2, 3, 4]);
    expect((0, numJS_1.all)((0, numJS_1.arrGTEq)(d, 5))).toBe(true);
    expect((0, numJS_1.all)((0, numJS_1.arrLT)(d, 10))).toBe(true);
});
test('choices', () => {
    const a = (0, numJS_1.arange)(12);
    let counts = (0, numJS_1.zeros)([a.length]);
    for (let i = 0; i < randIters; i++) {
        const c = (0, random_1.choices)(a, 3);
        for (const n of c) {
            counts[n]++;
        }
    }
    expect((0, numJS_1.allClose)(counts, 3 * randIters / a.length, 0.3)).toBe(true);
});
