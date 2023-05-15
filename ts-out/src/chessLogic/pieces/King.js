"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("../Color"));
const Piece_1 = require("./Piece");
const Rook_1 = __importDefault(require("./Rook"));
class King extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♔';
        this.whiteEmoji = '♚';
        this.type = King;
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
        return this._finiteMoves(direcs);
    }
    legalMoves() {
        const res = super.legalMoves();
        const rank = this.color === Color_1.default.White ? '1' : '8';
        if (!this.hasMoved) {
            const shortRook = this._board.pieceAt('h' + rank);
            const canShortCastle = (shortRook instanceof Rook_1.default &&
                !shortRook.hasMoved &&
                this._board.pieceAt('f' + rank) === null &&
                this._board.pieceAt('g' + rank) === null &&
                !this._board.putsKingInCheck('e' + rank, 'f' + rank) &&
                !this._board.putsKingInCheck('e' + rank, 'g' + rank) &&
                !this._board.putsKingInCheck('h' + rank, 'g' + rank) // is the king in check now?
            );
            if (canShortCastle) {
                res.add('g' + rank);
            }
            const longRook = this._board.pieceAt('a1');
            const canLongCastle = (longRook instanceof Rook_1.default &&
                !longRook.hasMoved &&
                this._board.pieceAt('b' + rank) === null &&
                this._board.pieceAt('c' + rank) === null &&
                this._board.pieceAt('d' + rank) === null &&
                !this._board.putsKingInCheck('e' + rank, 'd' + rank) &&
                !this._board.putsKingInCheck('e' + rank, 'c' + rank) &&
                !this._board.putsKingInCheck('a' + rank, 'b' + rank) // is the king in check now?
            );
            if (canLongCastle) {
                res.add('c' + rank);
            }
        }
        return res;
    }
}
exports.default = King;
