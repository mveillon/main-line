"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randArr = exports.choices = exports.shuffle = exports.choice = exports.randInt = void 0;
const numJS_1 = require("./numJS");
/**
 * Returns a random integer in between min (inclusive) and max (exclusive)
 * @param min the lower bound
 * @param max the upper bound. If not provided, the number will be between 0 and min
 * @returns a random integer in the provided range
 */
const randInt = (min, max) => {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
};
exports.randInt = randInt;
/**
 * Returns a randomly selected element of the array
 * @param arr the array to select an element from
 * @param ws optional cumulative weights for each element in arr
 * @returns one choice from the array
 */
const choice = (arr, ws) => {
    if (arr.length === 0) {
        throw new Error('Empty array not allowed in choice function');
    }
    if (typeof ws === 'undefined') {
        return arr[(0, exports.randInt)(arr.length)];
    }
    if (ws.length !== arr.length) {
        throw new Error(`Incompatible sizes between ${arr} and ${ws}: ${arr.length} vs ${ws.length}`);
    }
    if (!(0, numJS_1.all)((0, numJS_1.arrGTEq)(ws, 0))) {
        throw new Error(`Negative cumulative weights not allowed: ${ws}`);
    }
    for (let i = 1; i < ws.length; i++) {
        if (ws[i] < ws[i - 1]) {
            throw new Error(`Cumulative weights must be monotonically increasing: ${ws}`);
        }
    }
    const seed = Math.random() * ws[ws.length - 1];
    for (let i = 0; i < arr.length; i++) {
        if (ws[i] > seed) {
            return arr[i];
        }
    }
    return arr[arr.length - 1];
};
exports.choice = choice;
/**
 * Shuffles the array in place, using Fisher-Yates
 * O(arr.length)
 * @param arr the array to shuffle
 */
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = (0, exports.randInt)(i + 1);
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
};
exports.shuffle = shuffle;
/**
 * Returns n randomly selected elements from arr
 * O(arr.length)
 * @param arr the array to select the elements from
 * @param n how many elements to select
 * @returns n random elements from arr
 */
const choices = (arr, n) => {
    const arrCopy = (0, numJS_1.copyArr)(arr);
    (0, exports.shuffle)(arrCopy);
    return arrCopy.slice(0, n);
};
exports.choices = choices;
/**
 * Creates an array of random integers with the given shape
 * @param shape the shape of the output array
 * @param min the minimum possible integer. If max is `undefined`, this will
 * be the maximum possible integer, with `min` being `0`
 * @param max the maximum possible integer. If not specified, see above
 * @returns an array of random integers, each ranging from `[min, max)`
 */
const randArr = (shape, min, max) => {
    const size = shape.reduce((a, b) => a * b, 1);
    let flat = [];
    for (let i = 0; i < size; i++) {
        flat.push((0, exports.randInt)(min, max));
    }
    return (0, numJS_1.reshape)(flat, shape);
};
exports.randArr = randArr;
