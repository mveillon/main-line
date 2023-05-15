"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
class Knight extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♘';
        this.whiteEmoji = '♞';
        this.type = Knight;
    }
    legalMovesNoChecks() {
        const direcs = [
            [1, 2],
            [1, -2],
            [-1, 2],
            [-1, -2],
            [2, 1],
            [2, -1],
            [-2, 1],
            [-2, -1]
        ];
        return this._finiteMoves(direcs);
    }
}
exports.default = Knight;
