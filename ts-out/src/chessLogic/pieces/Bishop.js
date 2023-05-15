"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
class Bishop extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♗';
        this.whiteEmoji = '♝';
        this.type = Bishop;
    }
    legalMovesNoChecks() {
        const direcs = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
        ];
        return this._infiniteMoves(direcs);
    }
}
exports.default = Bishop;
