"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uciLineToPGN = exports.uciToAlgebraic = exports.uciToMove = exports.parseMove = exports.doubleMove = exports.pieceToAcronym = exports.acronymToPiece = void 0;
const Color_1 = __importDefault(require("./Color"));
const Bishop_1 = __importDefault(require("./pieces/Bishop"));
const King_1 = __importDefault(require("./pieces/King"));
const Knight_1 = __importDefault(require("./pieces/Knight"));
const Queen_1 = __importDefault(require("./pieces/Queen"));
const Rook_1 = __importDefault(require("./pieces/Rook"));
const Pawn_1 = __importDefault(require("./pieces/Pawn"));
const fenPGN_1 = require("./fenPGN");
/**
 * Returns the acronyms used for pieces in chess notation
 * @returns all piece acronyms
 */
const acronyms = () => {
    return {
        'B': Bishop_1.default,
        'K': King_1.default,
        'N': Knight_1.default,
        'Q': Queen_1.default,
        'R': Rook_1.default
    };
};
/**
 * Gets rid of any potential "1. " or "15. " substrings
 * that start the notation
 * @param notation the original notation
 * @returns the trimmed notation with just the moves
 */
const trimMoveNumber = (notation) => {
    const r = /^[0-9]+\./; // matches the turn number e.g. 4.
    const s = /\s{2,}/; // matches double (or more) whitespace
    return notation.replace(r, '').replace(s, ' ').trim();
};
/**
 * Converts the piece acronym (e.g. B or N) to the piece it
 * corresponds to. Acronym should be uppercase
 * @param acronym the piece acronym. If it is not a typical piece
 * acronym, it will default to Pawn
 * @returns the typeof the piece it corresponds to
 */
const acronymToPiece = (acronym) => {
    const acs = acronyms();
    if (typeof acs[acronym] === 'undefined') {
        return Pawn_1.default;
    }
    return acs[acronym];
};
exports.acronymToPiece = acronymToPiece;
/**
 * Returns the abbreviation associated with that piece, or an empty string for pawns
 * @param piece the piece type
 * @returns a lowercase char associated with that piece
 */
const pieceToAcronym = (piece) => {
    const abbrs = {
        [Bishop_1.default.name]: 'b',
        [King_1.default.name]: 'k',
        [Knight_1.default.name]: 'n',
        [Pawn_1.default.name]: '',
        [Queen_1.default.name]: 'q',
        [Rook_1.default.name]: 'r'
    };
    return abbrs[piece.name];
};
exports.pieceToAcronym = pieceToAcronym;
/**
 * Performs both moves of a PGN line such as 1. e4 e5
 * @param moveNotation the two moves to perform
 * @param board the board to perform the moves on
 */
const doubleMove = (moveNotation, board) => {
    moveNotation = trimMoveNumber(moveNotation);
    const moves = moveNotation.split(' ');
    (0, exports.parseMove)(moves[0], board);
    if (moves.length > 1) {
        (0, exports.parseMove)('...' + moves[1], board);
    }
};
exports.doubleMove = doubleMove;
/**
 * Makes the move given by the notation. Assumes the move is legal
 * @param notation the move, in chess notation. If it is black's move,
 * the notation should start with "..."
 */
const parseMove = (notation, board) => {
    notation = trimMoveNumber(notation);
    let turn;
    const ellipseRegex = /^\.\.\./;
    if (ellipseRegex.test(notation)) {
        turn = Color_1.default.Black;
        notation = notation.replace(ellipseRegex, '');
    }
    else {
        turn = Color_1.default.White;
    }
    const acs = acronyms();
    let promotionType = undefined;
    let lastInd = notation.length - 1;
    while (lastInd >= 0 &&
        isNaN(parseInt(notation[lastInd])) &&
        notation[lastInd] !== 'O') {
        // handles promotion, checks, checkmate, and decorations
        if (notation[lastInd] in acs) {
            promotionType = acs[notation[lastInd]];
        }
        lastInd--;
    }
    if (lastInd < 0) {
        throw new Error(`Invalid move ${notation}`);
    }
    if (lastInd < notation.length - 1) {
        notation = notation.slice(0, lastInd + 1);
    }
    const king = board.findPieces(King_1.default, turn)[0];
    if (notation === 'O-O') {
        board.movePiece(king.coords, 'g' + king.coords[1]);
    }
    else if (notation === 'O-O-O') {
        board.movePiece(king.coords, 'c' + king.coords[1]);
    }
    else {
        const pieceType = (0, exports.acronymToPiece)(notation[0]);
        let pieces;
        if (notation.length === 2) {
            // normal pawn move
            pieces = board.findPieces(pieceType, turn, notation[0]);
        }
        else if (notation.length === 3) {
            // normal piece move
            pieces = board.findPieces(pieceType, turn);
        }
        else {
            if (pieceType === Pawn_1.default) {
                // pawn capture
                pieces = board.findPieces(pieceType, turn, notation[0]);
            }
            else if (notation[1] === 'x') {
                // piece capture
                pieces = board.findPieces(pieceType, turn);
            }
            else {
                // two pieces can move to same square
                if (isNaN(parseInt(notation[1]))) {
                    // sort by file
                    pieces = board.findPieces(pieceType, turn, notation[1]);
                }
                else {
                    // sort by rank
                    pieces = board.findPieces(pieceType, turn, undefined, notation[1]);
                }
            }
        }
        const to = notation.slice(notation.length - 2);
        for (const p of pieces) {
            if (p.legalMoves().has(to)) {
                board.movePiece(p.coords, to, promotionType);
                break;
            }
        }
    }
};
exports.parseMove = parseMove;
/**
 * Converts a move in UCI long algebraic notation into something that can be
 * passed to Board.movePiece
 * @param uci the move notation
 * @returns `from`: where the piece moved from
 * @returns `to`: where the piece moved to
 * @returns `promoType`: what the piece promoted to, or undefined if there
 * was no promotion
 */
const uciToMove = (uci) => {
    let promotionType = undefined;
    if (uci.length > 4) {
        const p = uci[uci.length - 1];
        promotionType = acronyms()[p.toUpperCase()];
    }
    return [
        uci.slice(0, 2),
        uci.slice(2, 4),
        promotionType
    ];
};
exports.uciToMove = uciToMove;
/**
 * Converts the UCI notation into short algebraic notation e.g. `g1f3` becomes
 * `Nf3`
 * @param uci the UCI notation
 * @param board the board to make the move on
 * @returns the same move in short algebraic notation
 */
const uciToAlgebraic = (uci, board) => {
    const [from, to, promoType] = (0, exports.uciToMove)(uci);
    const piece = board.pieceAt(from);
    if (piece === null) {
        throw new Error(`${from} is an empty square`);
    }
    let parts = [];
    const castling = (piece instanceof King_1.default &&
        from[0] === 'e' &&
        (to[0] === 'c' || to[0] === 'g'));
    if (castling) {
        parts.push('O-O');
        if (to[0] === 'c') {
            parts.push('-O');
        }
    }
    else {
        parts.push((0, exports.pieceToAcronym)(piece.type).toUpperCase());
        if (piece instanceof Pawn_1.default && from[0] !== to[0]) {
            parts.push(from[0]);
        }
        else {
            const otherPieces = board.findPieces(piece.type, piece.color);
            for (const p of otherPieces) {
                if (p.coords !== piece.coords && p.legalMoves().has(to)) {
                    if (p.coords[0] === piece.coords[0]) {
                        parts.push(piece.coords[1]);
                    }
                    else {
                        parts.push(piece.coords[0]);
                    }
                    break;
                }
            }
        }
        if (board.pieceAt(to) !== null) {
            parts.push('x');
        }
        parts.push(to);
        if (piece instanceof Pawn_1.default && (to[1] === '1' || to[1] === '8')) {
            if (typeof promoType === 'undefined') {
                throw new Error(`Undefined promotion type moving ${from} to ${to}`);
            }
            parts.push(`=${(0, exports.pieceToAcronym)(promoType).toUpperCase()}`);
        }
    }
    board.movePiece(from, to, promoType);
    if (board.isInCheck(+!piece.color)) {
        if (board.canMove(+!piece.color)) {
            parts.push('+');
        }
        else {
            parts.push('#');
        }
    }
    board.undoLastMove();
    return parts.join('');
};
exports.uciToAlgebraic = uciToAlgebraic;
/**
 * Converts a list of UCI moves to a single PGN
 * @param line the moves to make
 * @param game the game to play them in
 * @returns the PGN
 */
const uciLineToPGN = (line, game) => {
    let moveNo = game.moveNumber;
    const lineParts = [];
    let formattedMove = [`${moveNo}. `];
    let turn = game.turn;
    if (turn === Color_1.default.Black) {
        formattedMove.push('...');
    }
    const oldFEN = (0, fenPGN_1.toFEN)(game);
    for (const move of line) {
        formattedMove.push((0, exports.uciToAlgebraic)(move, game.board) + ' ');
        game.board.movePiece(...(0, exports.uciToMove)(move));
        if (formattedMove.length === 3) {
            lineParts.push(formattedMove.join(''));
            formattedMove = [`${++moveNo}. `];
        }
    }
    if (formattedMove.length > 1) {
        lineParts.push(formattedMove.join(''));
    }
    (0, fenPGN_1.fromFEN)(oldFEN, game);
    return lineParts.join('');
};
exports.uciLineToPGN = uciLineToPGN;
