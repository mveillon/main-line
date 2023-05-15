"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bishop_1 = __importDefault(require("./pieces/Bishop"));
const King_1 = __importDefault(require("./pieces/King"));
const Knight_1 = __importDefault(require("./pieces/Knight"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const Queen_1 = __importDefault(require("./pieces/Queen"));
const Rook_1 = __importDefault(require("./pieces/Rook"));
const numJS_1 = require("../utils/numJS");
const Color_1 = __importDefault(require("./Color"));
const notationIndices_1 = require("./notationIndices");
/**
 * Computes the starting chess board, with all the pieces
 * initialized and in the correct position
 * @param board
 * @returns
 */
const startingPosition = (board) => {
    const res = (0, numJS_1.full)([8, 8], null);
    res[0] = [
        new Rook_1.default(Color_1.default.White, 'h1', board),
        new Knight_1.default(Color_1.default.White, 'g1', board),
        new Bishop_1.default(Color_1.default.White, 'f1', board),
        new King_1.default(Color_1.default.White, 'e1', board),
        new Queen_1.default(Color_1.default.White, 'd1', board),
        new Bishop_1.default(Color_1.default.White, 'c1', board),
        new Knight_1.default(Color_1.default.White, 'b1', board),
        new Rook_1.default(Color_1.default.White, 'a1', board)
    ];
    for (let i = 0; i < res[1].length; i++) {
        const file = (0, notationIndices_1.indexToLetter)(i);
        res[1][i] = new Pawn_1.default(Color_1.default.White, `${file}2`, board);
        res[6][i] = new Pawn_1.default(Color_1.default.Black, `${file}7`, board);
    }
    res[7] = [
        new Rook_1.default(Color_1.default.Black, 'h8', board),
        new Knight_1.default(Color_1.default.Black, 'g8', board),
        new Bishop_1.default(Color_1.default.Black, 'f8', board),
        new King_1.default(Color_1.default.Black, 'e8', board),
        new Queen_1.default(Color_1.default.Black, 'd8', board),
        new Bishop_1.default(Color_1.default.Black, 'c8', board),
        new Knight_1.default(Color_1.default.Black, 'b8', board),
        new Rook_1.default(Color_1.default.Black, 'a8', board)
    ];
    return res;
};
exports.default = startingPosition;
