"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("../../chessLogic/Board");
const Color_1 = __importDefault(require("../../chessLogic/Color"));
const notationIndices_1 = require("../../chessLogic/notationIndices");
const Bishop_1 = __importDefault(require("../../chessLogic/pieces/Bishop"));
const King_1 = __importDefault(require("../../chessLogic/pieces/King"));
const Knight_1 = __importDefault(require("../../chessLogic/pieces/Knight"));
const Pawn_1 = __importDefault(require("../../chessLogic/pieces/Pawn"));
const Queen_1 = __importDefault(require("../../chessLogic/pieces/Queen"));
const Rook_1 = __importDefault(require("../../chessLogic/pieces/Rook"));
test('starting position', () => {
    var _a, _b, _c, _d, _e, _f;
    const b = new Board_1.Board();
    const files = 'abcdefgh';
    expect(b.pieceAt('a1')).toBeInstanceOf(Rook_1.default);
    expect(b.pieceAt('b1')).toBeInstanceOf(Knight_1.default);
    expect(b.pieceAt('c1')).toBeInstanceOf(Bishop_1.default);
    expect(b.pieceAt('d1')).toBeInstanceOf(Queen_1.default);
    expect(b.pieceAt('e1')).toBeInstanceOf(King_1.default);
    expect(b.pieceAt('f1')).toBeInstanceOf(Bishop_1.default);
    expect(b.pieceAt('g1')).toBeInstanceOf(Knight_1.default);
    expect(b.pieceAt('h1')).toBeInstanceOf(Rook_1.default);
    for (const file of files) {
        expect((_a = b.pieceAt(`${file}1`)) === null || _a === void 0 ? void 0 : _a.color).toBe(Color_1.default.White);
        expect(b.pieceAt(`${file}2`)).toBeInstanceOf(Pawn_1.default);
        expect((_b = b.pieceAt(`${file}2`)) === null || _b === void 0 ? void 0 : _b.color).toBe(Color_1.default.White);
        expect((_c = b.pieceAt(`${file}8`)) === null || _c === void 0 ? void 0 : _c.color).toBe(Color_1.default.Black);
        expect(b.pieceAt(`${file}7`)).toBeInstanceOf(Pawn_1.default);
        expect((_d = b.pieceAt(`${file}7`)) === null || _d === void 0 ? void 0 : _d.color).toBe(Color_1.default.Black);
    }
    expect(typeof ((_e = b.pieceAt('h1')) === null || _e === void 0 ? void 0 : _e.toString())).toBe("string");
    expect(typeof ((_f = b.pieceAt('h8')) === null || _f === void 0 ? void 0 : _f.toString())).toBe('string');
});
test('movePiece', () => {
    var _a, _b, _c, _d;
    const b = new Board_1.Board();
    b.movePiece('e2', 'e4');
    expect(b.pieceAt('e2')).toBeNull();
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('e4')) === null || _a === void 0 ? void 0 : _a.coords).toBe('e4');
    expect((_b = b.pieceAt('e4')) === null || _b === void 0 ? void 0 : _b.color).toBe(Color_1.default.White);
    b.movePiece('e7', 'e5');
    expect(b.pieceAt('e7')).toBeNull();
    expect(b.pieceAt('e5')).toBeInstanceOf(Pawn_1.default);
    expect((_c = b.pieceAt('e5')) === null || _c === void 0 ? void 0 : _c.coords).toBe('e5');
    expect((_d = b.pieceAt('e5')) === null || _d === void 0 ? void 0 : _d.color).toBe(Color_1.default.Black);
});
test('blockedOOB', () => {
    const b = new Board_1.Board();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('a1'), Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('h1'), Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('a1'), Color_1.default.Black)).toBeFalsy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('h1'), Color_1.default.Black)).toBeFalsy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('a8'), Color_1.default.Black)).toBeTruthy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('h8'), Color_1.default.Black)).toBeTruthy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('a8'), Color_1.default.White)).toBeFalsy();
    expect(b.blockedOOB((0, notationIndices_1.notationToIndices)('h8'), Color_1.default.White)).toBeFalsy();
    expect(b.blockedOOB([-1, 7], Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB([-1, 7], Color_1.default.Black)).toBeTruthy();
    expect(b.blockedOOB([8, 0], Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB([8, 0], Color_1.default.Black)).toBeTruthy();
    expect(b.blockedOOB([0, -1], Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB([0, -1], Color_1.default.Black)).toBeTruthy();
    expect(b.blockedOOB([0, 8], Color_1.default.White)).toBeTruthy();
    expect(b.blockedOOB([0, 8], Color_1.default.Black)).toBeTruthy();
});
test('errors', () => {
    const b = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 e5 2. Nf3 Nf6 3. Bc4 *
  `);
    expect(() => { b.movePiece('e1', 'O-O'); }).toThrow();
    expect(() => { b.movePiece('f1', 'c4'); }).toThrow();
    b.movePiece('h1', 'f1');
    expect(() => { b.movePiece('e1', 'g1'); }).toThrow();
    const b2 = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 g6 3. fxg6 Nf6 4. gxh7 Rg8 *
  `);
    expect(() => { b2.movePiece('h7', 'g8'); }).toThrow();
    expect(() => b2.putsKingInCheck('g6', 'g7')).toThrow();
});
test('undo', () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const b = new Board_1.Board();
    expect(() => { b.undoLastMove(); }).toThrow();
    b.movePiece('e2', 'e4');
    b.undoLastMove();
    expect(b.pieceAt('e4')).toBeNull();
    expect(b.pieceAt('e2')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('e2')) === null || _a === void 0 ? void 0 : _a.hasMoved).toBeFalsy();
    expect((_b = b.pieceAt('e2')) === null || _b === void 0 ? void 0 : _b.coords).toBe('e2');
    b.movePiece('e2', 'e4');
    b.movePiece('d7', 'd5');
    b.movePiece('e4', 'd5');
    b.undoLastMove();
    expect(b.pieceAt('d5')).toBeInstanceOf(Pawn_1.default);
    expect((_c = b.pieceAt('d5')) === null || _c === void 0 ? void 0 : _c.color).toBe(Color_1.default.Black);
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    expect((_d = b.pieceAt('e4')) === null || _d === void 0 ? void 0 : _d.color).toBe(Color_1.default.White);
    expect((_e = b.pieceAt('d5')) === null || _e === void 0 ? void 0 : _e.hasMoved).toBeTruthy();
    expect((_f = b.pieceAt('e4')) === null || _f === void 0 ? void 0 : _f.hasMoved).toBeTruthy();
    expect((_g = b.pieceAt('d5')) === null || _g === void 0 ? void 0 : _g.coords).toBe('d5');
    expect((_h = b.pieceAt('e4')) === null || _h === void 0 ? void 0 : _h.coords).toBe('e4');
    b.movePiece('d5', 'd4');
    b.movePiece('c2', 'c4');
    b.movePiece('d4', 'c3');
    b.undoLastMove();
    expect(b.pieceAt('d4')).toBeInstanceOf(Pawn_1.default);
    expect((_j = b.pieceAt('d4')) === null || _j === void 0 ? void 0 : _j.coords).toBe('d4');
    expect((_k = b.pieceAt('d4')) === null || _k === void 0 ? void 0 : _k.color).toBe(Color_1.default.Black);
    expect((_l = b.pieceAt('d4')) === null || _l === void 0 ? void 0 : _l.hasMoved).toBeTruthy();
    expect(b.pieceAt('c4')).toBeInstanceOf(Pawn_1.default);
    expect((_m = b.pieceAt('c4')) === null || _m === void 0 ? void 0 : _m.coords).toBe('c4');
    expect((_o = b.pieceAt('c4')) === null || _o === void 0 ? void 0 : _o.color).toBe(Color_1.default.White);
    expect((_p = b.pieceAt('c4')) === null || _p === void 0 ? void 0 : _p.hasMoved).toBeTruthy();
    const b2 = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 d5 2. Nf3 Nc6 3. Bd3 Bg4 4. Nc3 Qd6 *
  `);
    b2.movePiece('e1', 'g1');
    b2.undoLastMove();
    expect(b2.pieceAt('e1')).toBeInstanceOf(King_1.default);
    expect((_q = b2.pieceAt('e1')) === null || _q === void 0 ? void 0 : _q.hasMoved).toBeFalsy();
    expect(b2.pieceAt('h1')).toBeInstanceOf(Rook_1.default);
    expect((_r = b2.pieceAt('h1')) === null || _r === void 0 ? void 0 : _r.hasMoved).toBeFalsy();
    b2.movePiece('e8', 'c8');
    b2.undoLastMove();
    expect(b2.pieceAt('e8')).toBeInstanceOf(King_1.default);
    expect((_s = b2.pieceAt('e8')) === null || _s === void 0 ? void 0 : _s.hasMoved).toBeFalsy();
    expect(b2.pieceAt('a8')).toBeInstanceOf(Rook_1.default);
    expect((_t = b2.pieceAt('a8')) === null || _t === void 0 ? void 0 : _t.hasMoved).toBeFalsy();
    const promotion = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 e6 3. fxe6 Nf6 4. exd7+ Kf7 *
  `);
    promotion.movePiece('d7', 'c8', Knight_1.default);
    promotion.undoLastMove();
    expect(promotion.pieceAt('c8')).toBeInstanceOf(Bishop_1.default);
    expect(promotion.pieceAt('d7')).toBeInstanceOf(Pawn_1.default);
});
test('skipping', () => {
    const b = new Board_1.Board();
    b.forwardOneMove();
    expect(b.sameBoard(new Board_1.Board())).toBeTruthy();
    b.backwardOneMove();
    expect(b.sameBoard(new Board_1.Board())).toBeTruthy();
    b.movePiece('e2', 'e4');
    b.movePiece('d7', 'd5');
    b.backwardOneMove();
    expect(b.pieceAt('d5')).toBeNull();
    expect(b.pieceAt('d7')).toBeInstanceOf(Pawn_1.default);
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    b.backwardOneMove();
    expect(b.pieceAt('e4')).toBeNull();
    expect(b.pieceAt('e2')).toBeInstanceOf(Pawn_1.default);
    b.forwardOneMove();
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    expect(b.pieceAt('e2')).toBeNull();
    expect(b.pieceAt('d5')).toBeNull();
    b.forwardOneMove();
    expect(b.pieceAt('d5')).toBeInstanceOf(Pawn_1.default);
});
