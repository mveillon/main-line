"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
const Color_1 = __importDefault(require("../Color"));
const notationIndices_1 = require("../notationIndices");
const numJS_1 = require("../../utils/numJS");
class Piece {
    /**
     * A piece on the board
     * @param _color who owns the piece
     * @param _coords the algebraic coordinates of the piece
     * @param board a pointer to the board its on
     */
    constructor(_color, _coords, board) {
        this.hasMoved = false;
        this.color = _color;
        this.coords = _coords;
        this._board = board;
    }
    /**
     * Finds all of the piece's legal moves, including checking if they
     * put the king in check
     * TODO : store these moves after calculating them to not have to
     * recalculate multiple times in the same move
     * @returns the set of legal moves of the piece
     */
    legalMoves() {
        const res = this.legalMovesNoChecks();
        for (let move of res) {
            if (this._board.putsKingInCheck(this.coords, move)) {
                res.delete(move);
            }
        }
        return res;
    }
    /**
     * Pieces that move in infinite straight lines (bishops, rooks, queens)
     * can use this helper method to find their legal moves just by providing
     * in which directions the piece can move
     * @param direcs direction vectors that represent which ways the piece can move
     * @returns all possible moves the piece can make not counting checks
     */
    _infiniteMoves(direcs) {
        const res = new Set();
        const current = (0, notationIndices_1.notationToIndices)(this.coords);
        for (const d of direcs) {
            let checking = (0, numJS_1.addArrays)(current, d);
            while (!this._board.blockedOOB(checking, this.color)) {
                const notation = (0, notationIndices_1.indicesToNotation)(...checking);
                res.add(notation);
                const p = this._board.pieceAt(notation);
                if (p !== null && p.color !== this.color) {
                    break;
                }
                checking = (0, numJS_1.addArrays)(checking, d);
            }
        }
        res.delete(this.coords);
        return res;
    }
    /**
     * Pieces that move only once towards a given direction (kings, knights)
     * can use this helper function to find all their moves
     * @param direcs which directions the piece moves in
     * @returns all the piece's legal moves, not looking for checks
     */
    _finiteMoves(direcs) {
        const res = new Set();
        const current = (0, notationIndices_1.notationToIndices)(this.coords);
        for (const d of direcs) {
            const newPos = (0, numJS_1.addArrays)(current, d);
            if (!this._board.blockedOOB(newPos, this.color)) {
                res.add((0, notationIndices_1.indicesToNotation)(...newPos));
            }
        }
        return res;
    }
    toString() {
        const cStr = this.color === Color_1.default.White ? 'White' : 'Black';
        return `${cStr} ${this.whiteEmoji} at ${this.coords}`;
    }
}
exports.Piece = Piece;
