"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
class Queen extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♕';
        this.whiteEmoji = '♛';
        this.type = Queen;
    }
    legalMovesNoChecks() {
        const direcs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
        ];
        return this._infiniteMoves(direcs);
    }
}
exports.default = Queen;
