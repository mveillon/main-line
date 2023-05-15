"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicesToNotation = exports.notationToIndices = exports.indexToLetter = exports.letterToCol = void 0;
const A_CODE = 'a'.charCodeAt(0);
const H_CODE = 'h'.charCodeAt(0);
/**
 * Within a BoardT, each letter corresponds to one column. For example,
 * the 1st column is the g file, meaning square g3 corresponds to a square
 * in the 1st column of the BoardT. This converts the letter to the
 * corresponding column
 * @param letter the file of the chess board. Should be between a and h
 * @returns which column within the BoardT it corresponds to
 */
const letterToCol = (letter) => {
    const code = letter.charCodeAt(0);
    if (code > H_CODE || code < A_CODE) {
        throw new Error(`Unexpected letter ${letter}. Should be between a and h`);
    }
    return H_CODE - code;
};
exports.letterToCol = letterToCol;
/**
 * Within a BoardT, each letter corresponds to one column. For example,
 * the 1st column is the g file, meaning square g3 corresponds to a square
 * in the 1st column of the BoardT. This converts the index to the
 * corresponding letter
 * @param ind the index within the BoardT
 * @returns the letter of the corresponding index. Will be between a and h
 */
const indexToLetter = (ind) => {
    if (ind < 0 || ind > 7) {
        throw new Error(`Index out of bounds ${ind}`);
    }
    return String.fromCharCode(H_CODE - ind);
};
exports.indexToLetter = indexToLetter;
/**
 * Converts the chess notation board square to indices to use in a BoardT
 * @param coords the chess notation coordinates e.g. h5
 * @returns an `[i, j]` pair of coordinates
 */
const notationToIndices = (coords) => {
    if (coords.length !== 2) {
        throw new Error(`Invalid coordinates ${coords}`);
    }
    return [
        parseInt(coords[1]) - 1,
        (0, exports.letterToCol)(coords[0])
    ];
};
exports.notationToIndices = notationToIndices;
/**
 * Converts the indices into a BoardT into chess notation
 * @param rank the rank of the square; the row of the BoardT
 * @param file the file of the square; the column of the BoardT
 * @returns the indices as chess notation
 */
const indicesToNotation = (rank, file) => {
    if (rank < 0 || rank > 7) {
        throw new Error(`Invalid indices [${rank}, ${file}]`);
    }
    return `${(0, exports.indexToLetter)(file)}${rank + 1}`;
};
exports.indicesToNotation = indicesToNotation;
