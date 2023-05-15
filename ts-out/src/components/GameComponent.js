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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BoardComponent_1 = __importDefault(require("./BoardComponent"));
const Game_1 = __importDefault(require("../chessLogic/Game"));
const Engine_1 = require("../chessLogic/Engine");
const parser_1 = require("../chessLogic/parser");
const fenPGN_1 = require("../chessLogic/fenPGN");
require("./styling/global.css");
const loading_gif_1 = __importDefault(require("../assets/loading.gif"));
const DEPTH = 5;
const LINE_LENGTH = 5;
function GameComponent(props) {
    let g = new Game_1.default(props.pgn);
    g.engineColors = [+!props.player];
    const [game, setGame] = (0, react_1.useState)(g);
    const [result, setResult] = (0, react_1.useState)('');
    const [review, setReview] = (0, react_1.useState)('');
    const [sf, setSF] = (0, react_1.useState)(new Engine_1.Engine(DEPTH, LINE_LENGTH));
    const [line, setLine] = (0, react_1.useState)('');
    const [showLine, setShowLine] = (0, react_1.useState)(false);
    const [thinking, setThinking] = (0, react_1.useState)(false);
    // quit Stockfish when component is unmounted
    (0, react_1.useEffect)(() => {
        if (game.turn !== props.player) {
            computerMove();
        }
        return () => { sf.quit(); };
    }, []);
    const computerMove = () => __awaiter(this, void 0, void 0, function* () {
        if (!game.engineColors.includes(game.turn))
            return;
        setThinking(true);
        const moves = yield sf.getBestMoves((0, fenPGN_1.toFEN)(game));
        game.playMove(...(0, parser_1.uciToMove)(moves[0].move));
        setGame(Object.assign(new Game_1.default(), game));
        updateRes();
        setThinking(false);
    });
    const updateRes = () => {
        const res = game.result;
        switch (res) {
            case '':
                computerMove();
                break;
            case '1-0':
                setResult('White wins by checkmate');
                break;
            case '0-1':
                setResult('Black wins by checkmate');
                break;
            case '1/2-1/2':
                setResult('Draw by stalemate');
                break;
            default:
                throw new Error(`Unrecognized game result ${res}`);
        }
    };
    const playMove = (from, to, promoType) => __awaiter(this, void 0, void 0, function* () {
        let uci = from + to;
        if (typeof promoType !== 'undefined') {
            uci += (0, parser_1.pieceToAcronym)(promoType);
        }
        const algebraic = (0, parser_1.uciToAlgebraic)(uci, game.board);
        const fen = (0, fenPGN_1.toFEN)(game);
        game.playMove(from, to, promoType);
        setGame(game);
        setThinking(true);
        const moves = yield sf.getBestMoves(fen);
        const revParts = [algebraic];
        if (uci === moves[0].move) {
            revParts.push('is the top engine move!');
        }
        else {
            let found = false;
            for (const move of moves) {
                if (move.move === uci) {
                    if (move.score > 0) {
                        revParts.push('is one of the top engine moves!');
                    }
                    else {
                        revParts.push('is ok, but not the best.');
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                revParts.push('is not good.');
            }
            game.board.undoLastMove();
            revParts.push(`The best move is ${(0, parser_1.uciToAlgebraic)(moves[0].move, game.board)}.`);
            game.board.movePiece(from, to, promoType);
        }
        const otherMoves = moves.filter((m, i) => m.score > 0 && i > 0 && i < LINE_LENGTH + 1);
        if (otherMoves.length > 0) {
            game.board.undoLastMove();
            revParts.push('Sidelines include');
            const moveStr = otherMoves.map(m => (0, parser_1.uciToAlgebraic)(m.move, game.board));
            moveStr[moveStr.length - 1] = 'and ' + moveStr[moveStr.length - 1];
            revParts.push(moveStr.join(', ') + '.');
            game.board.movePiece(from, to, promoType);
        }
        setReview(revParts.join(' '));
        game.board.undoLastMove();
        const pgn = (0, parser_1.uciLineToPGN)([moves[0].move, ...moves[0].line], game);
        game.board.movePiece(from, to, promoType);
        setLine(pgn);
        updateRes();
        setThinking(false);
    });
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'flex-row' }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(BoardComponent_1.default, { game: game, playMove: playMove, player: props.player }), (0, jsx_runtime_1.jsx)("p", { children: result })] }), (0, jsx_runtime_1.jsxs)("div", { children: [thinking &&
                        (0, jsx_runtime_1.jsx)("img", { src: loading_gif_1.default, alt: 'thinking...', height: '50px', width: '50px' }), (0, jsx_runtime_1.jsx)("p", { children: review }), line !== '' &&
                        (0, jsx_runtime_1.jsxs)("div", { children: [showLine &&
                                    (0, jsx_runtime_1.jsx)("p", { children: line }), (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => setShowLine(!showLine) }, { children: [showLine &&
                                            'Hide line', !showLine &&
                                            'Show line'] }))] })] })] })));
}
exports.default = GameComponent;
