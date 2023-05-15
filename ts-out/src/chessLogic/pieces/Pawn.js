"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const Color_1 = __importDefault(require("../Color"));
const notationIndices_1 = require("../notationIndices");
const Piece_1 = require("./Piece");
class Pawn extends Piece_1.Piece {
    constructor() {
        super(...arguments);
        this.blackEmoji = '♙';
        this.whiteEmoji = '♟';
        this.type = Pawn;
    }
    // assumes the pawn is not on the opposite rank i.e. if it can promote, 
    // it already has
    legalMovesNoChecks() {
        const res = new Set();
        const movesTowards = this.color === Color_1.default.White ? 1 : -1;
        const current = (0, notationIndices_1.notationToIndices)(this.coords);
        const oneUp = (0, numJS_1.addArrays)(current, [movesTowards, 0]);
        const oneUpNotation = (0, notationIndices_1.indicesToNotation)(...oneUp);
        if (!this._board.blockedOOB(oneUp, this.color) &&
            this._board.pieceAt(oneUpNotation) === null) {
            res.add(oneUpNotation);
            if (!this.hasMoved) {
                const twoUp = (0, numJS_1.addArrays)(current, [movesTowards * 2, 0]);
                const twoUpNotation = (0, notationIndices_1.indicesToNotation)(...twoUp);
                if (!this._board.blockedOOB(twoUp, this.color) &&
                    this._board.pieceAt(twoUpNotation) === null) {
                    res.add(twoUpNotation);
                }
            }
        }
        const takeDirecs = [
            [movesTowards, 1],
            [movesTowards, -1]
        ];
        for (const d of takeDirecs) {
            const newPos = (0, numJS_1.addArrays)(current, d);
            if (!this._board.blockedOOB(newPos, this.color)) {
                const notation = (0, notationIndices_1.indicesToNotation)(...newPos);
                const p = this._board.pieceAt(notation);
                if (p !== null && p.color !== this.color) {
                    res.add(notation);
                }
                const epRank = this.color === Color_1.default.White ? '5' : '4';
                if (this.coords[1] === epRank) {
                    const opStartRank = (this.color === Color_1.default.White ? '7' : '2');
                    const lastMove = this._board.lastMove;
                    const canPassant = (lastMove.to === notation[0] + epRank &&
                        lastMove.from === notation[0] + opStartRank &&
                        lastMove.pieceMoved instanceof Pawn);
                    if (canPassant) {
                        res.add(notation);
                    }
                }
            }
        }
        return res;
    }
}
exports.default = Pawn;
