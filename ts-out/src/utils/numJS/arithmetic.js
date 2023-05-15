"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumList = exports.colAverage = exports.scalarMul = exports.subArrays = exports.addArrays = void 0;
const shapes_1 = require("./shapes");
/**
 * Adds the two n-dimensional matrices element-wise.
 * ```
 * addArrays(1, 2) // output: 3
 * addArrays([1, 2, 3], [3, 4, 5]) // output: [4, 6, 8]
 * addArrays(2, [1, 2, 3]) // output: [3, 5, 7]
 * ```
 * @param a1 the first matrix
 * @param a2 the second matrix
 * @returns their element-wise sum
 */
const addArrays = (a1, a2) => {
    [a1, a2] = (0, shapes_1.broadcast)(a1, a2);
    if (Array.isArray(a1)) {
        let res = [];
        for (let i = 0; i < a1.length; i++) {
            res.push((0, exports.addArrays)(a1[i], a2[i]));
        }
        return res;
    }
    return a1 + a2;
};
exports.addArrays = addArrays;
/**
 * Subtracts the two n-dimensional matrices element-wise.
 * ```
 * subArrays(2, 1) // output: 1
 * subArrays([3, 4, 5], [1, 2, 3]) // output: [2, 2, 2]
 * subArrays([1, 2, 3], 1) // output: [0, 1, 2]
 * subArrays(3, [1, 2, 3]) // output: [2, 1, 0]
 * ```
 * @param a1 the first matrix
 * @param a2 the second matrix
 * @returns a1 - a2 element-wise
 */
const subArrays = (a1, a2) => {
    return (0, exports.addArrays)(a1, (0, exports.scalarMul)(a2, -1));
};
exports.subArrays = subArrays;
/**
 * Multiplies every element of A by x and returns a new matrix.
 * ```
 * scalarMul(1, 2) // output: 2
 * scalarMul([1, 2, 3], 3) // output: [3, 6, 9]
 * scalarMul([2, 4, 6], 0.5) // output: [1, 2, 3]
 * ```
 * @param x the scalar
 * @param A the matrix to multiply
 * @returns the result of x * A
 */
const scalarMul = (A, x) => {
    if (Array.isArray(A)) {
        let res = [];
        for (const row of A) {
            res.push((0, exports.scalarMul)(row, x));
        }
        return res;
    }
    return x * A;
};
exports.scalarMul = scalarMul;
/**
 * Returns the averages of the columns of A.
 * ```
 * colAverage([[1, 2], [3, 4]]) // output: [2, 3]
 * ```
 * @param A the 2D matrix to average
 * @returns the column-wise average of A
 */
const colAverage = (A) => {
    if (A.length === 0)
        return [];
    const total = A.reduce((accum, row) => (0, exports.addArrays)(accum, row), (0, shapes_1.zeros)([A[0].length]));
    return (0, exports.scalarMul)(total, 1 / A.length);
};
exports.colAverage = colAverage;
/**
 * Returns the sum of every element of the n-dimensional list.
 * ```
 * sumList(1) // output: 1
 * sumList([1, 2, 3]) // output: 6
 * sumList([[1, 2], [3, 4]]) // output: 10
 * ```
 * @param x the array of numbers
 * @returns the sum of every element in x
 */
const sumList = (x) => {
    if (Array.isArray(x)) {
        return x.map(exports.sumList).reduce((a, b) => a + b, 0);
    }
    return x;
};
exports.sumList = sumList;
