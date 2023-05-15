"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBool = exports.toNum = exports.ndMap = void 0;
/**
 * Maps func onto every element of x and returns a new array of the same shape as x.
 * ```
 * let double = n => 2 * n;
 * ndMap(1, double) // output: 2
 * ndMap([1, 2, 3], double) // output: [2, 4, 6]
 * ndMap([[1, 2], [3, 4, 5]], double) // output: [[2, 4], [6, 8, 10]]
 * ```
 * @param x the ndArray of any type
 * @param func a function that takes an element of x and returns something else
 * @returns func mapped onto x
 */
const ndMap = (x, func) => {
    if (Array.isArray(x)) {
        return x.map(nested => (0, exports.ndMap)(nested, func));
    }
    return func(x);
};
exports.ndMap = ndMap;
/**
 * Converts the array of booleans to numbers.
 * ```
 * toNum(false) // output: 0
 * toNum(true) // output: 1
 * toNum([true, false, false]) // output: [1, 0, 0]
 * toNum([[true, false], [false, false]]) // output: [[1, 0], [0, 0]]
 * ```
 * @param bools an nd array of bools
 * @returns the same array with every `true` mapped to one and every `false`
 * mapped to 0
 */
const toNum = (bools) => {
    return (0, exports.ndMap)(bools, b => +b);
};
exports.toNum = toNum;
/**
 * Converts the array of numbers to booleans.
 * ```
 * toBool(0) // output: false
 * toBool(2) // output: true
 * toBool([0, 1, 2]) // output: [false, true, true]
 * toBool([[0, 1], [-2, 0]]) // output: [[false, true], [true, false]]
 * ```
 * @param nums an nd array of numbers
 * @returns the same array with every zero mapped to `false` and every other
 * value mapped to `true`
 */
const toBool = (nums) => {
    return (0, exports.ndMap)(nums, n => !!n);
};
exports.toBool = toBool;
