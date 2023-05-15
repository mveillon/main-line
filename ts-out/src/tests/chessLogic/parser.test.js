"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpBoard = void 0;
const Board_1 = require("../../chessLogic/Board");
const Color_1 = __importDefault(require("../../chessLogic/Color"));
const parser_1 = require("../../chessLogic/parser");
const Bishop_1 = __importDefault(require("../../chessLogic/pieces/Bishop"));
const King_1 = __importDefault(require("../../chessLogic/pieces/King"));
const Knight_1 = __importDefault(require("../../chessLogic/pieces/Knight"));
const Pawn_1 = __importDefault(require("../../chessLogic/pieces/Pawn"));
const Queen_1 = __importDefault(require("../../chessLogic/pieces/Queen"));
const Rook_1 = __importDefault(require("../../chessLogic/pieces/Rook"));
const Game_1 = __importDefault(require("../../chessLogic/Game"));
const setUpBoard = (startingMoves) => {
    const res = new Board_1.Board();
    for (const move of startingMoves) {
        (0, parser_1.doubleMove)(move, res);
    }
    return res;
};
exports.setUpBoard = setUpBoard;
test('scholars mate', () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const b = new Board_1.Board();
    expect(() => { (0, parser_1.parseMove)('', b); }).toThrow();
    expect(() => { (0, parser_1.parseMove)('[hello]', b); }).toThrow();
    (0, parser_1.parseMove)('1. e4', b);
    expect(b.pieceAt('e2')).toBeNull();
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('e4')) === null || _a === void 0 ? void 0 : _a.hasMoved).toBeTruthy();
    expect((_b = b.pieceAt('e4')) === null || _b === void 0 ? void 0 : _b.color).toBe(Color_1.default.White);
    expect((_c = b.pieceAt('e4')) === null || _c === void 0 ? void 0 : _c.coords).toBe('e4');
    expect(b.pieceAt('e8')).toBeInstanceOf(King_1.default);
    (0, parser_1.parseMove)('1. ...e5', b);
    expect(b.pieceAt('e7')).toBeNull();
    expect(b.pieceAt('e5')).toBeInstanceOf(Pawn_1.default);
    expect((_d = b.pieceAt('e5')) === null || _d === void 0 ? void 0 : _d.color).toBe(Color_1.default.Black);
    expect((_e = b.pieceAt('e5')) === null || _e === void 0 ? void 0 : _e.coords).toBe('e5');
    expect(b.pieceAt('e8')).toBeInstanceOf(King_1.default);
    (0, parser_1.parseMove)('2. Qh5', b);
    expect(b.pieceAt('d1')).toBeNull();
    expect(b.pieceAt('h5')).toBeInstanceOf(Queen_1.default);
    expect((_f = b.pieceAt('h5')) === null || _f === void 0 ? void 0 : _f.color).toBe(Color_1.default.White);
    (0, parser_1.parseMove)('2. ...Nc6', b);
    expect(b.pieceAt('b8')).toBeNull();
    expect(b.pieceAt('c6')).toBeInstanceOf(Knight_1.default);
    expect((_g = b.pieceAt('c6')) === null || _g === void 0 ? void 0 : _g.color).toBe(Color_1.default.Black);
    (0, parser_1.parseMove)('3. Bc4', b);
    expect(b.pieceAt('f1')).toBeNull();
    expect(b.pieceAt('c4')).toBeInstanceOf(Bishop_1.default);
    (0, parser_1.parseMove)('3. ...Rb8??', b);
    expect(b.pieceAt('a8')).toBeNull();
    expect(b.pieceAt('b8')).toBeInstanceOf(Rook_1.default);
    expect(b.isInCheck(Color_1.default.Black)).toBeFalsy();
    (0, parser_1.parseMove)('4. Qxf7#', b);
    expect(b.pieceAt('h5')).toBeNull();
    expect(b.pieceAt('f7')).toBeInstanceOf(Queen_1.default);
    expect((_h = b.pieceAt('f7')) === null || _h === void 0 ? void 0 : _h.coords).toBe('f7');
    expect((_j = b.pieceAt('f7')) === null || _j === void 0 ? void 0 : _j.color).toBe(Color_1.default.White);
    expect(b.isInCheck(Color_1.default.Black)).toBeTruthy();
});
test('double move', () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const b = new Board_1.Board();
    (0, parser_1.doubleMove)('1. e4 e5', b);
    expect(b.pieceAt('e2')).toBeNull();
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('e4')) === null || _a === void 0 ? void 0 : _a.hasMoved).toBeTruthy();
    expect((_b = b.pieceAt('e4')) === null || _b === void 0 ? void 0 : _b.color).toBe(Color_1.default.White);
    expect((_c = b.pieceAt('e4')) === null || _c === void 0 ? void 0 : _c.coords).toBe('e4');
    expect(b.pieceAt('e7')).toBeNull();
    expect(b.pieceAt('e5')).toBeInstanceOf(Pawn_1.default);
    expect((_d = b.pieceAt('e5')) === null || _d === void 0 ? void 0 : _d.color).toBe(Color_1.default.Black);
    expect((_e = b.pieceAt('e5')) === null || _e === void 0 ? void 0 : _e.coords).toBe('e5');
    (0, parser_1.doubleMove)('2. Qh5 Nc6', b);
    expect(b.pieceAt('d1')).toBeNull();
    expect(b.pieceAt('h5')).toBeInstanceOf(Queen_1.default);
    expect((_f = b.pieceAt('h5')) === null || _f === void 0 ? void 0 : _f.color).toBe(Color_1.default.White);
    expect(b.pieceAt('b8')).toBeNull();
    expect(b.pieceAt('c6')).toBeInstanceOf(Knight_1.default);
    expect((_g = b.pieceAt('c6')) === null || _g === void 0 ? void 0 : _g.color).toBe(Color_1.default.Black);
    (0, parser_1.doubleMove)('3. Bc4 Rb8??', b);
    expect(b.pieceAt('f1')).toBeNull();
    expect(b.pieceAt('c4')).toBeInstanceOf(Bishop_1.default);
    expect(b.pieceAt('a8')).toBeNull();
    expect(b.pieceAt('b8')).toBeInstanceOf(Rook_1.default);
    (0, parser_1.doubleMove)('4. Qxf7#', b);
    expect(b.pieceAt('h5')).toBeNull();
    expect(b.pieceAt('f7')).toBeInstanceOf(Queen_1.default);
    expect((_h = b.pieceAt('f7')) === null || _h === void 0 ? void 0 : _h.coords).toBe('f7');
    expect((_j = b.pieceAt('f7')) === null || _j === void 0 ? void 0 : _j.color).toBe(Color_1.default.White);
});
test('captures', () => {
    var _a;
    const b = (0, exports.setUpBoard)([
        '1. e4 d5',
        '2. exd5'
    ]);
    expect(b.pieceAt('e4')).toBeNull();
    expect(b.pieceAt('d5')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('d5')) === null || _a === void 0 ? void 0 : _a.color).toBe(Color_1.default.White);
    (0, parser_1.parseMove)('2. ...Qxd5', b);
    expect(b.pieceAt('d8')).toBeNull();
    expect(b.pieceAt('d5')).toBeInstanceOf(Queen_1.default);
    (0, parser_1.doubleMove)('3. Nc3 Nf6', b);
    (0, parser_1.doubleMove)('4. Nh3 Nc6', b);
    (0, parser_1.doubleMove)('5. Nf4 Na5', b);
    (0, parser_1.parseMove)('6. Ncxd5!!', b);
    expect(b.pieceAt('d5')).toBeInstanceOf(Knight_1.default);
    expect(b.pieceAt('c3')).toBeNull();
    expect(b.pieceAt('f4')).toBeInstanceOf(Knight_1.default);
});
test('castling', () => {
    const b = (0, exports.setUpBoard)([
        '1. e4 d5',
        '2. Nf3 Nc6',
        '3. Bc4 Bf5',
        '4. Bxd5 Qxd5',
        '5. Ne5 Qxd2',
        '6. Qxd2 Na5',
        '7. f3 Nc6',
        '8. Qc3 Na5',
        '9. O-O'
    ]);
    expect(b.pieceAt('e1')).toBeNull();
    expect(b.pieceAt('h1')).toBeNull();
    expect(b.pieceAt('g1')).toBeInstanceOf(King_1.default);
    expect(b.pieceAt('f1')).toBeInstanceOf(Rook_1.default);
    (0, parser_1.parseMove)('9. ...Nc6', b);
    (0, parser_1.doubleMove)('10. Kf2 Na5', b);
    expect(b.pieceAt('g1')).toBeNull();
    expect(b.pieceAt('f2')).toBeInstanceOf(King_1.default);
    (0, parser_1.doubleMove)('11. Ke1 Nc6', b);
    (0, parser_1.doubleMove)('12. Kd1 O-O-O+', b);
    expect(b.pieceAt('e8')).toBeNull();
    expect(b.pieceAt('a8')).toBeNull();
    expect(b.pieceAt('c8')).toBeInstanceOf(King_1.default);
    expect(b.pieceAt('d8')).toBeInstanceOf(Rook_1.default);
});
test('differentiate pieces', () => {
    const b = (0, exports.setUpBoard)([
        '1. e4 h5',
        '2. d4 Rh6',
        '3. Nf3 Rc6',
        '4. Be2 Rc4',
        '5. Bf1 a5',
        '6. Be2 Ra6',
        '7. Bf1 Rac6'
    ]);
    expect(b.pieceAt('a6')).toBeNull();
    expect(b.pieceAt('c4')).toBeInstanceOf(Rook_1.default);
    expect(b.pieceAt('c6')).toBeInstanceOf(Rook_1.default);
    (0, parser_1.parseMove)('8. Nbd2', b);
    expect(b.pieceAt('b1')).toBeNull();
    expect(b.pieceAt('d2')).toBeInstanceOf(Knight_1.default);
    expect(b.pieceAt('f3')).toBeInstanceOf(Knight_1.default);
    (0, parser_1.parseMove)('8. ...R6c5', b);
    expect(b.pieceAt('c6')).toBeNull();
    expect(b.pieceAt('c5')).toBeInstanceOf(Rook_1.default);
    expect(b.pieceAt('c4')).toBeInstanceOf(Rook_1.default);
});
test('en passant', () => {
    var _a, _b;
    const b = (0, exports.setUpBoard)([
        '1. e4 c5',
        '2. e5 d5',
        '3. exd6'
    ]);
    expect(b.pieceAt('e5')).toBeNull();
    expect(b.pieceAt('d5')).toBeNull();
    expect(b.pieceAt('d6')).toBeInstanceOf(Pawn_1.default);
    expect((_a = b.pieceAt('d6')) === null || _a === void 0 ? void 0 : _a.color).toBe(Color_1.default.White);
    (0, parser_1.parseMove)('3. ...c4', b);
    (0, parser_1.doubleMove)('4. d4 cxd3', b);
    expect(b.pieceAt('c4')).toBeNull();
    expect(b.pieceAt('d4')).toBeNull();
    expect(b.pieceAt('d3')).toBeInstanceOf(Pawn_1.default);
    expect((_b = b.pieceAt('d3')) === null || _b === void 0 ? void 0 : _b.color).toBe(Color_1.default.Black);
});
test('promotion', () => {
    const b = (0, exports.setUpBoard)([
        '1. g4 h5',
        '2. gxh5 g5',
        '3. hxg6 f6',
        '4. g7 Nh6',
        '5. gxh8=Q'
    ]);
    const q = b.pieceAt('h8');
    expect(q).toBeInstanceOf(Queen_1.default);
    expect(q === null || q === void 0 ? void 0 : q.color).toBe(Color_1.default.White);
    expect(q === null || q === void 0 ? void 0 : q.coords).toBe('h8');
    const b2 = (0, exports.setUpBoard)([
        '1. g4 d5',
        '2. e4 dxe4',
        '3. d4 e3',
        '4. f3 e2',
        '5. Nh3 exd1=Q+'
    ]);
    const q2 = b2.pieceAt('d1');
    expect(q2).toBeInstanceOf(Queen_1.default);
    expect(q2 === null || q2 === void 0 ? void 0 : q2.color).toBe(Color_1.default.Black);
    expect(q2 === null || q2 === void 0 ? void 0 : q2.coords).toBe('d1');
});
test('uci', () => {
    expect((0, parser_1.uciToMove)('e2e4')).toEqual(['e2', 'e4', undefined]);
    expect((0, parser_1.uciToMove)('e7e8q')).toEqual(['e7', 'e8', Queen_1.default]);
});
test('uci to algebraic', () => {
    const b = new Board_1.Board();
    expect(() => (0, parser_1.uciToAlgebraic)('e3e4', b)).toThrow();
    expect((0, parser_1.uciToAlgebraic)('e2e4', b)).toBe('e4');
    expect((0, parser_1.uciToAlgebraic)('b8c6', b)).toBe('Nc6');
    b.movePiece('e2', 'e4');
    b.movePiece('d7', 'd5');
    expect((0, parser_1.uciToAlgebraic)('e4d5', b)).toBe('exd5');
    b.movePiece('g8', 'f6');
    expect((0, parser_1.uciToAlgebraic)('f6d7', b)).toBe('Nfd7');
    b.movePiece('e4', 'd5');
    expect((0, parser_1.uciToAlgebraic)('d8d5', b)).toBe('Qxd5');
    const rankDisambig = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. Nf3 e6 2. Nc3 Nh6 3. Ne5 Ng8 4. Nd5 Nh6 5. Ne3 *
  `);
    expect((0, parser_1.uciToAlgebraic)('e3c4', rankDisambig)).toBe('N3c4');
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
    expect(() => (0, parser_1.uciToAlgebraic)('d7c8', promotion)).toThrow();
    expect((0, parser_1.uciToAlgebraic)('d7c8N', promotion)).toBe('dxc8=N');
    const check = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 *
  `);
    expect((0, parser_1.uciToAlgebraic)('d1h5', check)).toBe('Qh5+');
    const mate = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f6 2. d3 g5 *
  `);
    expect((0, parser_1.uciToAlgebraic)('d1h5', mate)).toBe('Qh5#');
    const promoCheck = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 e6 3. fxe6 Qh4 4. e7 Nh6 
  `);
    expect((0, parser_1.uciToAlgebraic)('e7f8q', promoCheck)).toBe('exf8=Q+');
    const castling = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 d5 2. Nf3 Nc6 3. Bd3 Bf5 4. Nc3 Qd6 *
  `);
    expect((0, parser_1.uciToAlgebraic)('e1g1', castling)).toBe('O-O');
    expect((0, parser_1.uciToAlgebraic)('e8c8', castling)).toBe('O-O-O');
    const castleCheck = new Board_1.Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 g6 3. fxg6 e5 4. gxh7 Kf7 5. f4 exf4 6. g3 fxg3 7. Bd3 Nh6 8.
    Nh3 Nc6 *
  `);
    expect((0, parser_1.uciToAlgebraic)('e1g1', castleCheck)).toBe('O-O+');
});
test('piece acronym conversion', () => {
    expect((0, parser_1.pieceToAcronym)(Bishop_1.default)).toBe('b');
    expect((0, parser_1.pieceToAcronym)(Knight_1.default)).toBe('n');
    expect((0, parser_1.pieceToAcronym)(King_1.default)).toBe('k');
    expect((0, parser_1.pieceToAcronym)(Queen_1.default)).toBe('q');
    expect((0, parser_1.pieceToAcronym)(Rook_1.default)).toBe('r');
    expect((0, parser_1.acronymToPiece)('B')).toBe(Bishop_1.default);
    expect((0, parser_1.acronymToPiece)('Q')).toBe(Queen_1.default);
    expect((0, parser_1.acronymToPiece)('R')).toBe(Rook_1.default);
    expect((0, parser_1.acronymToPiece)('K')).toBe(King_1.default);
    expect((0, parser_1.acronymToPiece)('N')).toBe(Knight_1.default);
    expect((0, parser_1.acronymToPiece)('')).toBe(Pawn_1.default);
    expect((0, parser_1.acronymToPiece)('P')).toBe(Pawn_1.default);
});
test('uci line to pgn', () => {
    const g = new Game_1.default();
    const pgn = (0, parser_1.uciLineToPGN)([
        'e2e4',
        'd7d5',
        'g1f3',
        'b8c6'
    ], g);
    expect(g.board.sameBoard(new Board_1.Board())).toBeTruthy();
    g.board.forwardOneMove();
    expect(g.board.sameBoard(new Board_1.Board())).toBeTruthy();
    const pgn2 = '1. e4 d5 2. Nf3 Nc6';
    expect(pgn).toContain(pgn2);
    const pgn3 = (0, parser_1.uciLineToPGN)([
        'e2e4',
        'd7d5',
        'e4d5'
    ], g);
    const pgn4 = '1. e4 d5 2. exd5';
    expect(pgn3).toContain(pgn4);
    g.playMove('e2', 'e4');
    const pgn5 = (0, parser_1.uciLineToPGN)([
        'd7d5',
        'g1f3',
        'e7e5'
    ], g);
    const pgn6 = '1. ...d5 2. Nf3 e5';
    expect(pgn5).toContain(pgn6);
});
