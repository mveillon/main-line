"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameArr = exports.allEqual = exports.arrNot = exports.arrAnd = exports.arrOr = exports.arrGTEq = exports.arrGT = exports.arrLTEq = exports.arrLT = exports.arrEqual = exports.allClose = exports.isClose = void 0;
const shapes_1 = require("./shapes");
const anyAll_1 = require("./anyAll");
const ndMap_1 = require("./ndMap");
/**
 * Returns an array where `ith` element corresponds to whether `x[i]` is close enough to `y[i]`,
 * where close enough means within floating-point error bars. Uses the formula `abs(x - y) <= atol + rtol * abs(y)`.
 * ```
 * isClose(1, 1.0000000001) // output: true
 * isClose(1, 2) // output: false
 * isClose(1, 2, undefined, 1) // output: true
 * isClose([1, 2, 3], [1, 3, 3]) // output: [true, false, true]
 * isClose([[1, 2], [3, 4]], [[1, 3], [4, 4]]) // output: [[true, false], [false, true]]
 * ```
 * @param x the first array
 * @param y the second array
 * @param rtol the relative tolerance, which is multiplied by the elements of b
 * @param atol the absolute tolerance. Should be non-zero when x and y have elements that are both zero
 * @returns an ndArray of which values of x and y are close
 */
const isClose = (x, y, rtol = 1e-5, atol = 1e-8) => {
    [x, y] = (0, shapes_1.broadcast)(x, y);
    if (Array.isArray(x)) {
        let res = [];
        for (let i = 0; i < x.length; i++) {
            res.push((0, exports.isClose)(x[i], y[i], rtol, atol));
        }
        return res;
    }
    return Math.abs(x - y) <= atol + rtol * Math.abs(y);
};
exports.isClose = isClose;
/**
 * Returns whether every element of x is close to every element of y, using the formula
 * `abs(x - y) <= atol + rtol * abs(y)`.
 * ```
 * allClose(1, 1) // output: true
 * allClose(1, 2) // output: false
 * allClose([1, 2, 3], [1.000000001, 2, 3]) // output: true
 * allClose([1, 2, 3], [2, 2, 3]) // output: false
 * ```
 * @param x the first array
 * @param y the second array
 * @param rtol the relative tolerance, which is multiplied by the elements of b
 * @param atol the absolute tolerance. Should be non-zero when x and y have elements that are both zero
 * @returns whether every element of x is close to every element of y
 */
const allClose = (x, y, rtol = 1e-5, atol = 1e-8) => {
    return (0, anyAll_1.all)((0, exports.isClose)(x, y, rtol, atol));
};
exports.allClose = allClose;
/**
 * Compares a and b element-wise using the comp function
 * @param a the first array to compare
 * @param b the second array to compare
 * @param comp how to compare each element from a and b
 * @returns an ndArray of booleans corresponding to the result
 * of comp on each element of a and b
 */
const arrayComp = (a, b, comp) => {
    [a, b] = (0, shapes_1.broadcast)(a, b);
    if (Array.isArray(a)) {
        let res = [];
        for (let i = 0; i < a.length; i++) {
            res.push(arrayComp(a[i], b[i], comp));
        }
        return res;
    }
    return comp(a, b);
};
/**
 * Checks for equality of a and b element-wise and returns a new array
 * with the results.
 * ```
 * arrEqual(1, 1) // output: true
 * arrEqual(1, 2) // output: false
 * arrEqual([1, 2, 3], [2, 2, 3]) // output: [false, true, true]
 * arrEqual([1, 2, 3], [1.00000001, 2, 3]) // output: [false, true, true] (see isClose)
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether the
 * elements in the same position of a and b are equal
 */
const arrEqual = (a, b) => {
    return arrayComp(a, b, (x, y) => x === y);
};
exports.arrEqual = arrEqual;
/**
 * Checks for a < b element-wise and returns a new array
 * with the results.
 * ```
 * arrLT(1, 2) // output: true
 * arrLT(2, 1) // output: false
 * arrLT(1, 1) // output: false
 * arrLT([1, 2, 3], [1, 3, 2]) // output: [false, true, false]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether the
 * element in the same position of a is less than that of b
 */
const arrLT = (a, b) => {
    return arrayComp(a, b, (x, y) => x < y);
};
exports.arrLT = arrLT;
/**
 * Checks for a <= b element-wise and returns a new array
 * with the results.
 * ```
 * arrLTEq(1, 2) // output: true
 * arrLTEq(2, 1) // output: false
 * arrLTEq(1, 1) // output: true
 * arrLTEq([1, 2, 3], [1, 3, 2]) // output: [true, true, false]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether the
 * element in the same position of a is less than or equal to that of b
 */
const arrLTEq = (a, b) => {
    return arrayComp(a, b, (x, y) => x <= y);
};
exports.arrLTEq = arrLTEq;
/**
 * Checks for a > b element-wise and returns a new array
 * with the results.
 * ```
 * arrGT(1, 2) // output: false
 * arrGT(2, 1) // output: true
 * arrGT(1, 1) // output: false
 * arrGT([1, 2, 3], [1, 3, 2]) // output: [false, false, true]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether the
 * element in the same position of a is greater than that of b
 */
const arrGT = (a, b) => {
    return arrayComp(a, b, (x, y) => x > y);
};
exports.arrGT = arrGT;
/**
 * Checks for a >= b element-wise and returns a new array
 * with the results.
 * ```
 * arrGTEq(1, 2) // output: false
 * arrGTEq(2, 1) // output: true
 * arrGTEq(1, 1) // output: true
 * arrGTEq([1, 2, 3], [1, 3, 2]) // output: [true, false, true]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether the
 * element in the same position of a is greater than that of b
 */
const arrGTEq = (a, b) => {
    return arrayComp(a, b, (x, y) => x >= y);
};
exports.arrGTEq = arrGTEq;
/**
 * Computes the element-wise OR of two boolean arrays.
 * ```
 * arrOr(true, false) // output: true
 * arrOr(false, false) // output: false
 * arrOr([true, true, false], [false, false, false]) // output: [true, true, false]
 * arrOr([true, false, true], false) // output: [true, false, true]
 * arrOr(true, [[false, false], [false, false]]) // output: [[true, true], [true, true]]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether
 * either the element in the same position of a is true or that
 * of b is true
 */
const arrOr = (a, b) => {
    return arrayComp(a, b, (x, y) => x || y);
};
exports.arrOr = arrOr;
/**
 * Computes the element-wise AND of two boolean arrays.
 * ```
 * arrOr(true, false) // output: false
 * arrOr(true, true) // output: true
 * arrOr([true, true, false], [false, true, false]) // output: [false, true, false]
 * arrOr([true, false, true], true) // output: [true, false, true]
 * arrOr(true, [[false, false], [false, false]]) // output: [[false, false], [false, false]]
 * ```
 * @param a the first array
 * @param b the second array
 * @returns an array of booleans, each corresponding to whether
 * both the element in the same position of a is true and that
 * of b is true
 */
const arrAnd = (a, b) => {
    return arrayComp(a, b, (x, y) => x && y);
};
exports.arrAnd = arrAnd;
/**
 * Computes the element-wise NOT of a.
 * ```
 * arrNot(true) // output: false
 * arrNot(false) // output: true
 * arrNot([true, false, true]) // output: [false, true, false]
 * arrNot([[true, true], [false, false]]) // output: [[false, false], [true, true]]
 * ```
 * @param a the array to negate
 * @returns an array of booleans, each with the opposite value
 * of the same position in a
 */
const arrNot = (a) => {
    return (0, ndMap_1.ndMap)(a, x => !x);
};
exports.arrNot = arrNot;
/**
 * Returns whether a and b are all equal after broadcasting. Note that
 * a and b can have different shapes and this function can still return `true`.
 * If this is not desired, see `sameArr`.
 * ```
 * allEqual(1, 1) // output: true
 * allEqual(1, 2) // output: false
 * allEqual([1, 2, 3], [1, 2, 3]) // output: true
 * allEqual([1, 2, 3], [[1, 2, 3])) // output: false
 * ```
 * @param a the first array
 * @param b the second array
 * @returns whether a and b are element-wise equal
 */
const allEqual = (a, b) => {
    return (0, anyAll_1.all)((0, exports.arrEqual)(a, b));
};
exports.allEqual = allEqual;
/**
 * Returns whether every element of a and b are equal and that their shapes
 * are equal.
 * ```
 * allEqual(1, 1) // output: true
 * allEqual(1, 2) // output: false
 * allEqual([1, 2, 3], [1, 2, 3]) // output: true
 * allEqual([1, 2, 3], [[1, 2, 3]]) // output: true
 * ```
 * @param a the first array
 * @param b the second array
 * @returns whether a and b are recursively equal
 */
const sameArr = (a, b) => {
    const shape1 = (0, shapes_1.getShape)(a);
    const shape2 = (0, shapes_1.getShape)(b);
    return (shape1.length === shape2.length &&
        (0, exports.allEqual)(shape1, shape2) &&
        (0, exports.allEqual)(a, b));
};
exports.sameArr = sameArr;
