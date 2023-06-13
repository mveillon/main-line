import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Pawn from "./pieces/Pawn"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import { Board, BoardT } from "./Board"
import { full } from "../utils/numJS"
import COLOR from "./Color"
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
    new Rook(COLOR.WHITE, 'h1', board),
    new Knight(COLOR.WHITE, 'g1', board),
    new Bishop(COLOR.WHITE, 'f1', board),
    new King(COLOR.WHITE, 'e1', board),
    new Queen(COLOR.WHITE, 'd1', board),
    new Bishop(COLOR.WHITE, 'c1', board),
    new Knight(COLOR.WHITE, 'b1', board),
    new Rook(COLOR.WHITE, 'a1', board)
  ]

  for (let i = 0; i < res[1].length; i++) {
    const file = indexToLetter(i)
    res[1][i] = new Pawn(
      COLOR.WHITE,
      `${file}2`,
      board
    )

    res[6][i] = new Pawn(
      COLOR.BLACK,
      `${file}7`,
      board
    )
  }

  res[7] = [
    new Rook(COLOR.BLACK, 'h8', board),
    new Knight(COLOR.BLACK, 'g8', board),
    new Bishop(COLOR.BLACK, 'f8', board),
    new King(COLOR.BLACK, 'e8', board),
    new Queen(COLOR.BLACK, 'd8', board),
    new Bishop(COLOR.BLACK, 'c8', board),
    new Knight(COLOR.BLACK, 'b8', board),
    new Rook(COLOR.BLACK, 'a8', board)
  ]

  return res
}

export default startingPosition
