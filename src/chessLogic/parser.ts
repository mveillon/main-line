import { Board } from "./Board"
import Color from "./Color"
import Piece from "./pieces/Piece"
import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"

/**
 * Converts the piece acronym (e.g. B or N) to the piece it 
 * corresponds to
 * @param acronym the piece acronym. Not to be used for Pawns
 * @returns the typeof the piece it corresponds to
 */
export const pieceAcronym = (acronym: string): typeof Piece => {
    return ({
        'B': Bishop,
        'K': King,
        'N': Knight,
        'Q': Queen,
        'R': Rook
    } as { [index: string]: typeof Piece })[acronym]
}

/**
 * Castles for whoever's turn it is. Moves the king to the new `kingFile`
 * and whichever rook is on `oldRookFile` to `newRookFile`
 * @param kingFile which file should the king move to
 * @param oldRookFile which file the rook should currently be on
 * @param newRookFile which file should the rook move to
 * @param board the current board
 */
const castle = (
    turn: Color,
    kingFile: string, 
    oldRookFile: string, 
    newRookFile: string, 
    board: Board) => {

    const king = board.findPieces(King, turn)[0]
    const allRooks = board.findPieces(Rook, turn, oldRookFile)
    if (allRooks.length === 0) {
        throw new Error(`There is no rook on the correct square!`)
    }
    
    const rank = turn === Color.White ? '1' : '8'
    board.movePiece(king.coords, kingFile + rank)
    board.movePiece(allRooks[0].coords, newRookFile + rank)
}

/**
 * Makes the move given by the notation. Assumes the move is legal
 * @param notation the move, in chess notation. If it is black's move,
 * the notation should start with "..."
 */
export const move = (notation: string, board: Board) => {
    let turn: Color;
    const afterEllipse = notation.slice(0, 3)
    if (afterEllipse === "...") {
        turn = Color.Black
        notation = afterEllipse
    } else {
        turn = Color.White
    }

    if (notation === 'O-O') {
        castle(turn, 'g', 'h', 'f', board)
    } else if (notation === 'O-O-O') {
        castle(turn, 'c', 'a', 'd', board)
    }

    // TODO : pawn moves and other pieces
}

