"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colVariance = exports.sigmoid = exports.variance = exports.dot = void 0;
const shapes_1 = require("./shapes");
const metrics_1 = require("./metrics");
const measuresOfCenter_1 = require("./measuresOfCenter");
const arithmetic_1 = require("./arithmetic");
/**
 * Returns the dot product of x and y
 * ```
 * dot([1], [2]) // output: 2
 * dot([1, 2, 3], [4, 5, 6]) // output: 32
 * ```
 * @param x the first vector
 * @param y the second vector
 * @returns the dot product
 */
const dot = (x, y) => {
    let res = 0;
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
        res += x[i] * y[i];
    }
    return res;
};
exports.dot = dot;
/**
 * Computes the variance (square of the standard deviation) of x.
 * ```
 * variance([1, 1, 1, 1]) // output: 0
 * variance([0, 1, 1, 2]) // output; 0.6666667
 * ```
 * @param x the array to measure
 * @returns the variance of x
 */
const variance = (x) => {
    return (0, metrics_1.squareDistance)(x, (0, measuresOfCenter_1.mean)(x)) / ((0, shapes_1.getSize)(x) - 1);
};
exports.variance = variance;
/**
 * Sigmoid function to floor x to somewhere between 0 and 1
 * ```
 * sigmoid(0) // output: 0.5
 * sigmoid(1) // output: ~0.731
 * sigmoid(-1) // output: ~0.2689
 * ```
 * @param x the number to reduce
 * @returns `1 / (1 + Math.exp(-x))`
 */
const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
};
exports.sigmoid = sigmoid;
/**
 * Returns the column-wise variances of x.
 * ```
 * colVariance([[0, 1, 2], [0, 2, 1]]) // output: [0, 0.5, 0.5]
 * ```
 * @param x the matrix to measure
 * @returns the column-wise variances of x
 */
const colVariance = (x) => {
    const avgs = (0, arithmetic_1.colAverage)(x);
    let sums = (0, shapes_1.zeros)([avgs.length]);
    for (const row of x) {
        let diffs = [];
        for (let i = 0; i < row.length; i++) {
            diffs.push(Math.pow(row[i] - avgs[i], 2));
        }
        sums = (0, arithmetic_1.addArrays)(sums, diffs);
    }
    return (0, arithmetic_1.scalarMul)(sums, 1 / (x.length - 1));
};
exports.colVariance = colVariance;
