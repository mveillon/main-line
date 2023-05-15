"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSetToArray = void 0;
const compareSetToArray = (s, arr) => {
    expect(s.size).toBe(arr.length);
    for (const el of arr) {
        expect(s.has(el)).toBeTruthy();
    }
};
exports.compareSetToArray = compareSetToArray;
