"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert = exports.eye = exports.transpose = exports.matMul = void 0;
const shapes_1 = require("./shapes");
const arithmetic_1 = require("./arithmetic");
const calculations_1 = require("./calculations");
const comparing_1 = require("./comparing");
/**
 * Multiplies the two matrices together. If both matrices are vectors,
 * computes their dot product.
 * ```
 * matMul(2, 3) // output: 6
 * matMul(5, [1, 2, 3, 4]) // output: [5, 10, 15, 20]
 * matMul(5, [[1, 2], [3, 4]]) // output: [[5, 10], [15, 20]]
 * matMul([1, 2, 3], [4, 5, 6]) // output: 32
 * matMul([[1, 2], [3, 4]], [[1, 0], [0, 1]]) // output: [[1, 2], [3, 4]]
 * matMul([[1, 2], [3, 4]], [5, 6]) // output: [17, 39]
 * matMul([5, 6], [[1, 2], [3, 4]]) // output: [23, 34]
 * ```
 * @param m1 the first matrix
 * @param m2 the second matrix
 * @returns the matrix multiplication of m1 and m2
 */
const matMul = (m1, m2) => {
    let shape1 = (0, shapes_1.getShape)(m1);
    let shape2 = (0, shapes_1.getShape)(m2);
    if (shape1.length === 0) {
        return (0, arithmetic_1.scalarMul)(m2, m1);
    }
    if (shape2.length === 0) {
        return (0, arithmetic_1.scalarMul)(m1, m2);
    }
    if (shape1.length === 1 && shape2.length === 1) {
        return (0, calculations_1.dot)(m1, m2);
    }
    if (shape1.length === 1) {
        m1 = [m1];
        shape1 = [1, shape1[0]];
    }
    else if (shape2.length === 1) {
        shape2 = [shape2[0], 1];
        m2 = (0, shapes_1.reshape)(m2, shape2);
    }
    if (shape1[1] !== shape2[0]) {
        throw new Error('Matrix multiplication shapes not compatible ' +
            `[${(0, shapes_1.getShape)(m1)}] vs [${(0, shapes_1.getShape)(m2)}]`);
    }
    let res = (0, shapes_1.zeros)([shape1[0], shape2[1]]);
    // iteration order from https://cs61.seas.harvard.edu/wiki/images/0/0f/Lec14-Cache_measurement.pdf
    for (let k = 0; k < shape1[1]; k++) {
        for (let i = 0; i < shape1[0]; i++) {
            const point = m1[i][k];
            for (let j = 0; j < shape2[1]; j++) {
                res[i][j] += point * m2[k][j];
            }
        }
    }
    if (shape1[0] === 1) {
        return res[0];
    }
    if (shape2[1] === 1) {
        return (0, shapes_1.reshape)(res, [shape1[0]]);
    }
    return res;
};
exports.matMul = matMul;
/**
 * Transposes m.
 * ```
 * transpose([[1, 2], [3, 4]]) // output: [[1, 3], [2, 4]]
 * transpose([[1, 2], [3, 4], [5, 6]]) // output: [[1, 3, 5], [2, 4, 6]]
 * ```
 * @param m the matrix to transpose
 * @returns the transposed matrix
 */
const transpose = (m) => {
    let res = [];
    for (let j = 0; j < m[0].length; j++) {
        let row = [];
        for (let i = 0; i < m.length; i++) {
            row.push(m[i][j]);
        }
        res.push(row);
    }
    return res;
};
exports.transpose = transpose;
/**
 * Returns the identity matrix with a length and width of len.
 * By definition, `matMul(eye, m)` for any `m` returns `m`, and
 * the same is true of `matMul(m, eye)`.
 * @param len how large the matrix should be
 * @returns a matrix with all zeros except along the diagonal are ones
 */
const eye = (len) => {
    let res = (0, shapes_1.zeros)([len, len]);
    for (let i = 0; i < len; i++) {
        res[i][i] = 1;
    }
    return res;
};
exports.eye = eye;
/**
 * Finds the row-reduced echelon form of m, meaning the matrix is
 * in echelon form, the column of each row's left-most
 * non-zero value (the pivot) has only one non-zero value, located
 * in that row, and that pivot value is always a one. Output is saved to m
 * @param m the matrix to row-reduce. Assumed to be square. Output is saved here
 */
const rowReduce = (m) => {
    echelon(m, 0);
    for (let i = 0; i < m.length; i++) {
        let pivot = -1;
        while (++pivot < m[i].length && m[i][pivot] === 0) { }
        if (pivot === m[i].length)
            break;
        m[i] = (0, arithmetic_1.scalarMul)(m[i], 1 / m[i][pivot]);
        for (let i2 = 0; i2 < m.length; i2++) {
            if (i !== i2) {
                m[i2] = (0, arithmetic_1.subArrays)(m[i2], (0, arithmetic_1.scalarMul)(m[i], m[i2][pivot]));
            }
        }
    }
};
/**
 * Converts the matrix to echelon form, meaning the column of
 * each row's left-most non-zero value is to the right of that of
 * the row above it. The output is saved to m
 * @param m the matrix to reduce. Assumed to be square. Output is saved here
 * @param n which row and column to change in this recursion
 */
const echelon = (m, n) => {
    if (n === m.length)
        return;
    let largest = n;
    for (let i = n + 1; i < m.length; i++) {
        if (m[largest][n] < m[i][n]) {
            largest = i;
        }
    }
    let temp;
    if (largest !== n) {
        temp = m[n];
        m[n] = m[largest];
        m[largest] = temp;
    }
    if (m[n][n] !== 0) {
        for (let i = n + 1; i < m.length; i++) {
            m[i] = (0, arithmetic_1.subArrays)(m[i], (0, arithmetic_1.scalarMul)(m[n], m[i][n] / m[n][n]));
        }
    }
    echelon(m, n + 1);
};
/**
 * Returns the multiplicative inverse of m. By definition,
 * `matMul(invert(m), m)` equals the identity matrix, as does
 * `matMul(m, invert(m))`. m must be square
 * ```
 * invert([[1, 2], [3, 4]]) // output: [[-2, 1], [1.5, -0.5]]
 * ```
 * @param m the matrix to invert
 * @returns the inverse of m
 */
const invert = (m) => {
    const shape = (0, shapes_1.getShape)(m);
    if (m.length === 0 || m.length !== m[0].length) {
        throw new Error(`Singular matrix with shape [${shape}]`);
    }
    const i = (0, exports.eye)(m.length);
    let aug = m.map((r, ind) => r.concat(i[ind]));
    rowReduce(aug);
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (!(0, comparing_1.isClose)(aug[i][j], +(i === j))) {
                throw new Error('Singular matrix: element at ' +
                    `[${i}, ${j}] should be ${+(i === j)} ` +
                    `but is ${aug[i][j]}`);
            }
        }
    }
    return aug.map(r => r.slice(m.length, aug[0].length));
};
exports.invert = invert;
