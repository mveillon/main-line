"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squaredMag = exports.correlation = exports.manhattanDistance = exports.squareDistance = exports.mse = void 0;
const arithmetic_1 = require("./arithmetic");
const shapes_1 = require("./shapes");
const measuresOfCenter_1 = require("./measuresOfCenter");
/**
 * Calculates the mean squared error between x and y.
 * x and y can be of any shape and are broadcast and compared
 * element-wise.
 * ```
 * mse([0, 1, 2], [3, 2, 1]) // output: 3.66666667
 * mse([0, 1, 2], 1) // output: 0.66666667
 * mse([[0, 1], [2, 3]], [0, 1, 2, 3]) // output: 0
 * ```
 * @param x the first array of numbers
 * @param y the second array of numbers
 * @returns the mean squared error between x and y
 */
const mse = (x, y) => {
    const l = Math.max((0, shapes_1.getSize)(x), (0, shapes_1.getSize)(y));
    return l === 0 ? 0 : (0, exports.squareDistance)(x, y) / l;
};
exports.mse = mse;
/**
 * Returns the square (for efficiency) of the Euclidean distance
 * between x and y. Arrays are broadcast and compared element-wise
 * ```
 * squareDistance([0, 1, 2], [3, 2, 1]) // output: 11
 * squareDistance([0, 1, 2], 1) // output: 2
 * squareDistance([[0, 1], [2, 3]], [0, 1, 2, 3]) // output: 0
 * ```
 * @param x the first array/vector
 * @param y the second array/vector
 * @returns the squared distance between x and y
 */
const squareDistance = (x, y) => {
    [x, y] = (0, shapes_1.broadcast)(x, y);
    if (Array.isArray(x)) {
        let total = 0;
        for (let i = 0; i < x.length; i++) {
            total += (0, exports.squareDistance)(x[i], y[i]);
        }
        return total;
    }
    return Math.pow(x - y, 2);
};
exports.squareDistance = squareDistance;
/**
 * Computes the Manhattan distance between x and y. x and y are broadcast
 * together and compared element-wise.
 * ```
 * manhattanDistance([0, 1, 2], [3, 2, 1]) // output: 5
 * manhattanDistance([0, 1, 2], 1) // output: 2
 * manhattanDistance([[0, 1], [2, 3]], [0, 1, 2, 3]) // output: 0
 * ```
 * @param x the first array of numbers
 * @param y the second array of numbers
 * @returns the Manhattan distance between x and y
 */
const manhattanDistance = (x, y) => {
    [x, y] = (0, shapes_1.broadcast)(x, y);
    if (Array.isArray(x)) {
        let total = 0;
        for (let i = 0; i < x.length; i++) {
            total += (0, exports.manhattanDistance)(x[i], y[i]);
        }
        return total;
    }
    return Math.abs(x - y);
};
exports.manhattanDistance = manhattanDistance;
/**
 * Returns the correlation between x and y. x and y are broadcast together
 * and compared element-wise. A correlation of 1 means a perfect positive
 * correlation, while -1 means a perfect negative correlation. 0 means no
 * correlation.
 * ```
 * correlation([1, 2, 3], [4, 5, 6]) // output: 1
 * correlation([[1, 2], [3, 4]], [-1, -2, -3, -4]) // output: -1
 * correlation([1, 2, 3], [1, 1, 1]) // output: 0
 * correlation([1, 2, 3], 1) // output: 0
 * ```
 * @param x
 * @param y
 * @returns
 */
const correlation = (x, y) => {
    [x, y] = (0, shapes_1.broadcast)(x, y);
    const xAvg = (0, measuresOfCenter_1.mean)(x);
    const yAvg = (0, measuresOfCenter_1.mean)(y);
    const helper = (arr1, arr2) => {
        if (Array.isArray(arr1)) {
            let num = 0;
            let denom = [0, 0];
            for (let i = 0; i < arr1.length; i++) {
                const [subNum, subDenom] = helper(arr1[i], arr2[i]);
                num += subNum;
                denom = (0, arithmetic_1.addArrays)(denom, subDenom);
            }
            return [num, denom];
        }
        const xDiff = arr1 - xAvg;
        const yDiff = arr2 - yAvg;
        return [
            xDiff * yDiff,
            [Math.pow(xDiff, 2), Math.pow(yDiff, 2)]
        ];
    };
    const [num, [d1, d2]] = helper(x, y);
    const prod = d1 * d2;
    return prod === 0 ? 0 : num / Math.sqrt(prod);
};
exports.correlation = correlation;
/**
 * Returns the square (for efficiency) of the magnitude (distance from origin)
 * of x.
 * ```
 * squaredMag(1) // output: 1
 * squaredMag([1, 2, 3]) // output: 14
 * squaredMag([[1, 2], [3, 4]]) // output: 30
 * ```
 * @param x
 * @returns
 */
const squaredMag = (x) => {
    return (0, exports.squareDistance)(x, 0);
};
exports.squaredMag = squaredMag;
