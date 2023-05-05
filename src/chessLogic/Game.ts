import { Board } from "./Board";
import Color from "./Color";
import { Piece } from "./pieces/Piece";

class Game {
  board: Board
  turn: Color = Color.White
  result: string = ''

  constructor(pgn?: string) {
    this.board = new Board(pgn)
  }

  /**
   * Tries to move the piece at `from` to `to`. If the move is not possible
   * or legal, this function does nothing. After the move, checks if the
   * game is over
   * @param from the square of the piece to move
   * @param to the square to move the piece to
   */
  playMove(from: string, to: string) {
    const moving = this.board.pieceAt(from)
    if (
      this.result !== '' && 
      moving !== null && 
      moving.legalMoves().has(to)
    ) {
      this.board.movePiece(from, to)
      this.turn = this.turn === Color.White ? Color.Black : Color.White

      const allPieces = this.board.findPieces(Piece, this.turn)
      let canMove = false
      for (const p of allPieces) {
        if (p.legalMoves().size > 0) {
          canMove = true
          break
        }
      }

      if (!canMove) {
        if (this.board.isInCheck(this.turn)) {
          this.result = this.turn === Color.White ? '0-1' : '1-0'
        } else {
          this.result = '1/2-1/2'
        }
      }
    }
  }
}

export default Game
