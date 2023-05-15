"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const Piece_1 = require("./pieces/Piece");
const Color_1 = __importDefault(require("./Color"));
const startingPosition_1 = __importDefault(require("./startingPosition"));
const notationIndices_1 = require("./notationIndices");
const King_1 = __importDefault(require("./pieces/King"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const Queen_1 = __importDefault(require("./pieces/Queen"));
const Rook_1 = __importDefault(require("./pieces/Rook"));
const fenPGN_1 = require("./fenPGN");
class Board {
    get lastMove() {
        return this.movesMade[this.movePointer];
    }
    /**
     * A board of pieces. Just handles the pieces, not whose turn it is
     * or any engine integration
     * @param pgn the starting PGN
     */
    constructor(pgn) {
        this.movePointer = -1;
        this.board = (0, startingPosition_1.default)(this);
        this.movesMade = [];
        if (typeof pgn !== 'undefined') {
            (0, fenPGN_1.fromPGN)(pgn, this);
        }
    }
    toString() {
        const line = '   --- --- --- --- --- --- --- --- ';
        let rows = [line];
        for (let i = this.board.length - 1; i >= 0; i--) {
            let current = [`${i + 1} |`];
            for (let j = this.board[i].length - 1; j >= 0; j--) {
                const square = this.board[i][j];
                current.push(' ');
                if (square === null) {
                    current.push(' ');
                }
                else {
                    if (square.color === Color_1.default.White) {
                        current.push(square.whiteEmoji);
                    }
                    else {
                        current.push(square.blackEmoji);
                    }
                }
                current.push(' ');
                current.push('|');
            }
            rows.push(current.join(''));
            rows.push(line);
        }
        rows.push('    a   b   c   d   e   f   g   h  ');
        return rows.join('\n');
    }
    /**
     * Finds the piece at the given coordinates.
     * Coordinates should be in chess notation e.g. h5
     * @param coords the coordinates of the square
     * @returns the piece at that square, or null if the square is empty
     */
    pieceAt(coords) {
        const [i, j] = (0, notationIndices_1.notationToIndices)(coords);
        return this.board[i][j];
    }
    /**
     * Finds all of `color`'s pieces of the given `pieceType` e.g. all of
     * white's knights
     * TODO : this should be more efficient ideally. Right now it's `O(n^2)`
     * @param pieceType which type the piece is
     * @param color who owns the piece
     * @param file optional param for which file the piece should be on
     * @param rank optional param for which rank the piece should be on
     * @returns a list of all the matching pieces
     */
    findPieces(pieceType, color, file, rank) {
        let res = [];
        for (const row of this.board) {
            for (const square of row) {
                if (square !== null &&
                    square instanceof pieceType &&
                    square.color === color &&
                    (typeof file === "undefined" || square.coords[0] === file) &&
                    (typeof rank === "undefined" || square.coords[1] === rank)) {
                    res.push(square);
                }
            }
        }
        return res;
    }
    /**
     * Moves the piece at `from` to `to`, regardless of whether it's legal
     * @param from the starting square
     * @param to the ending square
     * @param promoteType what type of piece to promote to if the move
     * promotes a pawn
     */
    movePiece(from, to, promoteType) {
        if (to === 'O-O' || to === 'O-O-O') {
            throw new Error('To castle, move the king from the e file to either the c or g file');
        }
        const [fromI, fromJ] = (0, notationIndices_1.notationToIndices)(from);
        const [toI, toJ] = (0, notationIndices_1.notationToIndices)(to);
        const p = this.board[fromI][fromJ];
        if (p === null) {
            throw new Error(`${from} is an empty square`);
        }
        const info = {
            from: from,
            to: to,
            captured: this.pieceAt(to),
            hadMoved: p.hasMoved,
            promoType: promoteType,
            enPassant: (p instanceof Pawn_1.default &&
                toJ !== fromJ &&
                this.pieceAt(to) === null),
            pieceMoved: p
        };
        if (info.enPassant) {
            info.captured = this.board[fromI][toJ];
            this.board[fromI][toJ] = null;
        }
        this.movePointer++;
        if (typeof this.lastMove === 'undefined' ||
            (this.lastMove.to !== to || this.lastMove.from !== from)) {
            if (this.movePointer < this.movesMade.length) {
                this.movesMade[this.movePointer] = info;
                this.movesMade.splice(this.movePointer + 1);
            }
            else {
                this.movesMade.push(info);
            }
        }
        if (p instanceof King_1.default &&
            p.coords[0] === 'e' &&
            (to[0] === 'c' || to[0] === 'g')) {
            const rookFile = to[0] === 'c' ? 'a' : 'h';
            const rook = this.pieceAt(rookFile + p.coords[1]);
            if (rook === null) {
                throw new Error('No rook to castle with!');
            }
            const newRookFile = to[0] === 'c' ? 'd' : 'f';
            this.movePiece(rook.coords, newRookFile + to[1], promoteType);
            this.movesMade.pop();
            this.movePointer--;
        }
        this.board[toI][toJ] = p;
        this.board[fromI][fromJ] = null;
        p.coords = to;
        if (p instanceof Pawn_1.default && (to[1] === '1' || to[1] === '8')) {
            if (typeof promoteType === 'undefined') {
                throw new Error(`Undefined promotion type for promoting move when moving ${from} to ${to}`);
            }
            this._promotePawn(p, promoteType);
        }
        p.hasMoved = true;
    }
    /**
     * Promotes the pawn into the given promoteType
     * @param pawn the pawn to promote. Should already be on the final rank
     * @param promoteType what type to promote to e.g. Queen or Knight
     */
    _promotePawn(pawn, promoteType) {
        const [i, j] = (0, notationIndices_1.notationToIndices)(pawn.coords);
        this.board[i][j] = new promoteType(pawn.color, pawn.coords, this);
    }
    /**
     * Checks whether a piece can move to the given square as
     * long as the piece would be able to move there if it was
     * empty. Specifically checks if the player already has a piece
     * there or if the square is out of bounds
     * @param coords the coords to move to
     * @param color whose turn it is
     * @returns whether the square is out of bounds and unoccupied or
     * occupied by an opposing piece. `true` if the square is blocked,
     * `false` otherwise
     */
    blockedOOB(coords, color) {
        if (coords[0] < 0 || coords[0] >= this.board.length ||
            coords[1] < 0 || coords[1] >= this.board[0].length) {
            return true;
        }
        const p = this.board[coords[0]][coords[1]];
        return p !== null && p.color === color;
    }
    /**
     * Checks whether, after moving the piece at `from` to `to`, whether
     * the king would be in check. Assumes the piece moving matches the
     * king that would be checked.
     * @param from the position the piece is moving from.
     * @param to the position the piece is moving to
     * @returns whether the move would put the king in check
     */
    putsKingInCheck(from, to) {
        const p = this.pieceAt(from);
        if (p === null) {
            throw new Error(`${from} is an empty square`);
        }
        // promotion type doesn't matter
        this.movePiece(from, to, Queen_1.default);
        const res = this.isInCheck(p.color);
        this.undoLastMove();
        return res;
    }
    /**
     * Checks whether the two boards have the pieces in the same position.
     * Does not check whose turn it is or who still has castling rights
     * @param b2 the other board to check
     * @returns whether the two boards are the same
     */
    sameBoard(b2) {
        return this.toString() === b2.toString();
    }
    /**
     * Returns whether the `color` king is currently in check
     * @param color which king to look at
     * @returns whether that king is in check
     */
    isInCheck(color) {
        const kingPos = this.findPieces(King_1.default, color)[0].coords;
        const otherPieces = this.findPieces(Piece_1.Piece, +!color);
        for (const p of otherPieces) {
            if (p.legalMovesNoChecks().has(kingPos)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns whether `player` has any legal moves
     * @param player which player to check
     * @returns whether `player` can move
     */
    canMove(player) {
        const allPieces = this.findPieces(Piece_1.Piece, player);
        for (const p of allPieces) {
            if (p.legalMoves().size > 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * Undoes the last move played, reversing all side effects
     */
    undoLastMove() {
        if (this.movePointer < 0) {
            throw new Error('Nothing to undo');
        }
        this.backwardOneMove();
        this.movesMade.splice(this.movePointer + 1);
    }
    /**
     * Skips to the next move in this.movesMade, if possible. Otherwise, this does
     * nothing
     */
    forwardOneMove() {
        const toMake = this.movesMade[this.movePointer + 1];
        if (typeof toMake !== 'undefined') {
            this.movePiece(toMake.from, toMake.to, toMake.promoType);
        }
    }
    /**
     * Skips to the most recent move in this.movesMade, if possible. Otherwise, this does
     * nothing
     */
    backwardOneMove() {
        const toUndo = this.lastMove;
        this.movePointer--;
        if (typeof toUndo === 'undefined') {
            return;
        }
        const [fromI, fromJ] = (0, notationIndices_1.notationToIndices)(toUndo.from);
        const [toI, toJ] = (0, notationIndices_1.notationToIndices)(toUndo.to);
        this.board[fromI][fromJ] = toUndo.pieceMoved;
        toUndo.pieceMoved.coords = toUndo.from;
        this.board[toI][toJ] = null;
        if (toUndo.captured !== null) {
            // can't use toI and toJ because of en passant
            const [capI, capJ] = (0, notationIndices_1.notationToIndices)(toUndo.captured.coords);
            this.board[capI][capJ] = toUndo.captured;
        }
        toUndo.pieceMoved.hasMoved = toUndo.hadMoved;
        if (toUndo.pieceMoved instanceof King_1.default &&
            Math.abs(fromJ - toJ) > 1) {
            // castling
            const rank = toUndo.pieceMoved.coords[1];
            const oldRook = toUndo.to[0] === 'c' ? 'a' : 'h';
            const newRook = toUndo.to[0] === 'c' ? 'd' : 'f';
            const [oldI, oldJ] = (0, notationIndices_1.notationToIndices)(oldRook + rank);
            const [newI, newJ] = (0, notationIndices_1.notationToIndices)(newRook + rank);
            this.board[newI][newJ] = null;
            this.board[oldI][oldJ] = new Rook_1.default(toUndo.pieceMoved.color, oldRook + rank, this);
        }
    }
}
exports.Board = Board;
