"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
class Rook extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♖';
        this.whiteEmoji = '♜';
        this.type = Rook;
    }
    legalMovesNoChecks() {
        const direcs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        return this._infiniteMoves(direcs);
    }
}
exports.default = Rook;
