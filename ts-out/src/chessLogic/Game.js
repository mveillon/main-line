"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
const Color_1 = __importDefault(require("./Color"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const fenPGN_1 = require("./fenPGN");
class Game {
    get result() {
        if (!this.board.canMove(this.turn)) {
            if (this.board.isInCheck(this.turn)) {
                return this.turn === Color_1.default.White ? '0-1' : '1-0';
            }
            return '1/2-1/2';
        }
        return '';
    }
    /**
     * A game of chess between two players or computers. If both `pgn` and
     * `fen` are provided, `fen` will be used because it is faster
     * @param pgn the starting position as a PGN
     * @param fen the starting position as a FEN
     */
    constructor(pgn, fen) {
        this.turn = Color_1.default.White;
        this.halfMoves = 0;
        this.moveNumber = 1;
        if (typeof fen !== 'undefined') {
            this.board = new Board_1.Board();
            (0, fenPGN_1.fromFEN)(fen, this);
        }
        else {
            this.board = new Board_1.Board(pgn);
            if (this.board.movePointer >= 0) {
                this.turn = (+!this.board.lastMove.pieceMoved.color);
                let moveInd = this.board.movePointer;
                while (moveInd >= 0) {
                    const m = this.board.movesMade[moveInd--];
                    if (m.pieceMoved instanceof Pawn_1.default || m.captured !== null) {
                        break;
                    }
                }
                this.halfMoves = this.board.movePointer - moveInd - 1;
                this.moveNumber = 1 + Math.floor((this.board.movePointer + 1) / 2);
            }
        }
        this.engineColors = [];
    }
    /**
     * Returns whether this move resets the half move counter
     * @param from where the piece moved from
     * @param to where the piece moved to
     * @returns whether it resets the half move counter
     */
    _resetHalfMoves(from, to) {
        return (this.board.pieceAt(to) !== null ||
            this.board.pieceAt(from) instanceof Pawn_1.default);
    }
    /**
     * Tries to move the piece at `from` to `to`. If the move is not possible
     * or legal, this function does nothing. After the move, checks if the
     * game is over
     * @param from the square of the piece to move
     * @param to the square to move the piece to
     * @param promoType what kind of piece to promote to
     */
    playMove(from, to, promoType) {
        const moving = this.board.pieceAt(from);
        if (this.result === '' &&
            moving !== null &&
            moving.color === this.turn &&
            moving.legalMoves().has(to)) {
            if (this._resetHalfMoves(from, to)) {
                this.halfMoves = 0;
            }
            else {
                this.halfMoves++;
            }
            if (this.turn === Color_1.default.Black) {
                this.moveNumber++;
            }
            this.board.movePiece(from, to, promoType);
            this.turn = +!this.turn;
        }
    }
}
exports.default = Game;
