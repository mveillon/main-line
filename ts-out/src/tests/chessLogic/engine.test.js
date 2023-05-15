"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("../../chessLogic/Game"));
const Engine_1 = require("../../chessLogic/Engine");
const parser_1 = require("../../chessLogic/parser");
const Color_1 = __importDefault(require("../../chessLogic/Color"));
const Piece_1 = require("../../chessLogic/pieces/Piece");
const Queen_1 = __importDefault(require("../../chessLogic/pieces/Queen"));
const Rook_1 = __importDefault(require("../../chessLogic/pieces/Rook"));
const Knight_1 = __importDefault(require("../../chessLogic/pieces/Knight"));
const Bishop_1 = __importDefault(require("../../chessLogic/pieces/Bishop"));
const fenPGN_1 = require("../../chessLogic/fenPGN");
jest.setTimeout(2147483647);
// jest.setTimeout(5000)
beforeEach(() => {
    // we do this because Stockfish makes some `fetch` calls, but only if `fetch`
    // is a function. Should NOT be done anywhere else. You should use a mock function
    // instead. 
    // @ts-ignore
    global.fetch = undefined;
});
const checkMove = (move, mover, game) => {
    const [from, to, promoType] = (0, parser_1.uciToMove)(move);
    const fromPiece = game.board.pieceAt(from);
    expect(fromPiece).toBeInstanceOf(Piece_1.Piece);
    expect(fromPiece === null || fromPiece === void 0 ? void 0 : fromPiece.color).toBe(mover);
    const toPiece = game.board.pieceAt(to);
    expect(toPiece === null || toPiece.color !== mover).toBeTruthy();
    if (typeof promoType !== 'undefined') {
        expect([Queen_1.default, Rook_1.default, Knight_1.default, Bishop_1.default]).toContain(promoType);
    }
};
test('engine', () => __awaiter(void 0, void 0, void 0, function* () {
    const g = new Game_1.default();
    const e = new Engine_1.Engine(5, 5);
    try {
        g.playMove('e2', 'e4');
        let moves = yield e.getBestMoves((0, fenPGN_1.toFEN)(g));
        expect(moves.length).toBe(5);
        for (const m of moves) {
            checkMove(m.move, Color_1.default.Black, g);
        }
        g.playMove('d7', 'd5');
        moves = yield e.getBestMoves((0, fenPGN_1.toFEN)(g));
        expect(moves.length).toBe(5);
        for (const m of moves) {
            checkMove(m.move, Color_1.default.White, g);
        }
    }
    finally {
        e.quit();
    }
}));
