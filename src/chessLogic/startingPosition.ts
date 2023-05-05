import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Pawn from "./pieces/Pawn"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import type { Board, BoardT } from "./Board"
import { full } from "../utils/numJS"
import Color from "./Color"
import { indexToLetter } from "./notationIndices"

/**
 * Computes the starting chess board, with all the pieces
 * initialized and in the correct position
 * @param board 
 * @returns 
 */
const startingPosition = (board: Board): BoardT => {
    const res = (full([8, 8], null) as BoardT)
    res[0] = [
        new Rook(Color.White, 'h1', board),
        new Knight(Color.White, 'g1', board),
        new Bishop(Color.White, 'f1', board),
        new King(Color.White, 'e1', board),
        new Queen(Color.White, 'd1', board),
        new Bishop(Color.White, 'c1', board),
        new Knight(Color.White, 'b1', board),
        new Rook(Color.White, 'a1', board)
    ]

    for (let i = 0; i < res[1].length; i++) {
        const file = indexToLetter(i)
        res[1][i] = new Pawn(
            Color.White,
            `${file}2`,
            board
        )

        res[6][i] = new Pawn(
            Color.Black,
            `${file}7`,
            board
        )
    }

    res[7] = [
        new Rook(Color.Black, 'h8', board),
        new Knight(Color.Black, 'g8', board),
        new Bishop(Color.Black, 'f8', board),
        new King(Color.Black, 'e8', board),
        new Queen(Color.Black, 'd8', board),
        new Bishop(Color.Black, 'c8', board),
        new Knight(Color.Black, 'b8', board),
        new Rook(Color.Black, 'a8', board)
    ]

    return res
}

export default startingPosition
