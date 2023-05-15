"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFEN = exports.fromFEN = exports.fromPGN = void 0;
const notationIndices_1 = require("./notationIndices");
const parser_1 = require("./parser");
const parser_2 = require("./parser");
const Color_1 = __importDefault(require("./Color"));
const King_1 = __importDefault(require("./pieces/King"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const Rook_1 = __importDefault(require("./pieces/Rook"));
/**
 * Initializes a board from a PGN
 * @param pgn the PGN to use
 * @param board the board to initialize
 */
const fromPGN = (pgn, board) => {
    const r = /[0-9]+\./; // matches the move numbers
    // matches parenthesis and text between them. Also matches
    // curly braces and square braces
    // modified from https://stackoverflow.com/questions/640001/how-can-i-remove-text-within-parentheses-with-a-regex
    const paren = /(\(|\{|\[).*(\)|\}|\])/gm;
    // matches the game result e.g. 0-1 or 1-0
    const result = /(0-1|1-0|1\/2-1\/2)/;
    const asterisk = /\*/;
    pgn = pgn.replace(paren, '');
    pgn = pgn.replace(result, '');
    pgn = pgn.replace(asterisk, '');
    const moves = pgn.split(r);
    for (let i = 1; i < moves.length; i++) {
        (0, parser_1.doubleMove)(moves[i].trim(), board);
    }
};
exports.fromPGN = fromPGN;
/**
 * Initializes a game from a FEN
 * @param fen the FEN to use
 * @param game the game to initialize
 */
const fromFEN = (fen, game) => {
    const parts = fen.split(' ');
    if (parts.length !== 6) {
        throw new Error(`Invalid FEN: ${fen}`);
    }
    const [layout, turn, castlingRights, passantTarget, halfMoves, fullMoves] = parts;
    const boardInd = (n) => game.board.board.length - 1 - n;
    const ranks = layout.split('/');
    for (let i = 0; i < ranks.length; i++) {
        const rankInd = boardInd(i);
        let j = 0;
        for (const square of ranks[i]) {
            const numSkip = parseInt(square);
            if (isNaN(numSkip)) {
                const pieceType = (0, parser_2.acronymToPiece)(square.toUpperCase());
                const p = new pieceType(square.toUpperCase() === square ? Color_1.default.White : Color_1.default.Black, (0, notationIndices_1.indicesToNotation)(rankInd, boardInd(j)), game.board);
                game.board.board[rankInd][boardInd(j++)] = p;
                const startRank = p.color === Color_1.default.White ? '2' : '7';
                if (p instanceof Pawn_1.default && p.coords[1] !== startRank) {
                    p.hasMoved = false;
                }
            }
            else {
                for (let k = 0; k < numSkip; k++) {
                    game.board.board[rankInd][boardInd(j++)] = null;
                }
            }
        }
    }
    game.turn = turn === 'w' ? Color_1.default.White : Color_1.default.Black;
    if (castlingRights === '-') {
        game.board.findPieces(King_1.default, Color_1.default.White)[0].hasMoved = false;
        game.board.findPieces(King_1.default, Color_1.default.Black)[0].hasMoved = false;
    }
    else {
        const sides = {
            k: 'h8', q: 'a8', K: 'h1', Q: 'a1'
        };
        for (const side in sides) {
            if (!castlingRights.includes(side)) {
                const rook = game.board.pieceAt(sides[side]);
                if (rook !== null) {
                    rook.hasMoved = true;
                }
            }
        }
    }
    if (passantTarget !== '-') {
        const oldRank = passantTarget[1] === '3' ? '2' : '7';
        const newRank = passantTarget[1] === '3' ? '4' : '5';
        const pawn = game.board.pieceAt(passantTarget[0] + newRank);
        if (pawn === null) {
            throw new Error(`No pawn can be en passanted at ${passantTarget[0] + newRank}`);
        }
        const toPush = {
            from: passantTarget[0] + oldRank,
            to: passantTarget[0] + newRank,
            captured: null,
            hadMoved: false,
            enPassant: false,
            pieceMoved: pawn
        };
        game.board.movesMade.push(toPush);
        game.board.movePointer++;
    }
    game.halfMoves = parseInt(halfMoves);
    game.moveNumber = parseInt(fullMoves);
};
exports.fromFEN = fromFEN;
/**
 * Generates a FEN string to describe the board
 * @returns a single line of text that describes the entire position
 */
const toFEN = (game) => {
    const allRows = [];
    for (let i = game.board.board.length - 1; i >= 0; i--) {
        const row = [];
        let emptySpaces = 0;
        for (let j = game.board.board[i].length - 1; j >= 0; j--) {
            const square = game.board.board[i][j];
            if (square === null) {
                emptySpaces++;
                if (j === 0) {
                    row.push(emptySpaces.toString());
                }
            }
            else {
                if (emptySpaces > 0) {
                    row.push(emptySpaces.toString());
                    emptySpaces = 0;
                }
                let a = (0, parser_2.pieceToAcronym)(square.type);
                if (square instanceof Pawn_1.default) {
                    a = 'p';
                }
                if (square.color === Color_1.default.Black) {
                    row.push(a);
                }
                else {
                    row.push(a.toUpperCase());
                }
            }
        }
        allRows.push(row.join(''));
    }
    const parts = [allRows.join('/')];
    parts.push(game.turn === Color_1.default.White ? 'w' : 'b');
    const castling = [];
    for (const c of [Color_1.default.White, Color_1.default.Black]) {
        const king = game.board.findPieces(King_1.default, c)[0];
        if (!king.hasMoved) {
            const rookFiles = [
                {
                    file: 'h',
                    meaning: 'k'
                },
                {
                    file: 'a',
                    meaning: 'q'
                }
            ];
            for (const rook of rookFiles) {
                const r = game.board.pieceAt(rook.file + king.coords[1]);
                if (r instanceof Rook_1.default && r.color === c && !r.hasMoved) {
                    castling.push(c === Color_1.default.White ? rook.meaning.toUpperCase() : rook.meaning);
                }
            }
        }
    }
    if (castling.length > 0) {
        parts.push(castling.join(''));
    }
    else {
        parts.push('-');
    }
    if (game.board.movePointer < 0) {
        parts.push('-');
    }
    else {
        const lastMove = game.board.lastMove;
        const ranks = [parseInt(lastMove.from[1]), parseInt(lastMove.to[1])];
        const isTarget = (lastMove.pieceMoved instanceof Pawn_1.default &&
            !lastMove.hadMoved &&
            Math.abs(ranks[0] - ranks[1]) === 2);
        if (isTarget) {
            parts.push(lastMove.to[0] +
                (Math.round(ranks[0] + ranks[1]) / 2).toString());
        }
        else {
            parts.push('-');
        }
    }
    parts.push(game.halfMoves.toString());
    parts.push(game.moveNumber.toString());
    return parts.join(' ');
};
exports.toFEN = toFEN;
