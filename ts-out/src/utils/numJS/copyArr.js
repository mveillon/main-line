"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyArr = void 0;
/**
 * Returns a semi-shallow copy of arr. Changing any of the subarrays of the copy
 * will not change the original, but changing a value within a subarray might
 * change the same value in the original.
 * ```
 * let a = [1, 2, 3];
 * let b = a;
 * a[0] = 0;
 * console.log(b[0]); // output: 0
 * a = [1, 2, 3]
 * let c = copyArr(a);
 * a[0] = 0;
 * console.log(c[0]); // output: 1
 *
 * a[0] = {one: 1, two: 2, three: 3};
 * c = copyArr(a);
 * a[0].one = 2;
 * console.log(c[0].one); // output: 2
 * ```
 * @param arr the array to copy
 * @returns a shallow copy of arr with the same elements
 */
const copyArr = (arr) => {
    if (Array.isArray(arr)) {
        return arr.map(exports.copyArr);
    }
    return arr;
};
exports.copyArr = copyArr;
