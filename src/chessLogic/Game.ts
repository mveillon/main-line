import { Board } from "./Board";
import Color from "./Color";
import Pawn from "./pieces/Pawn";
import { PieceT } from "./pieces/Piece";
import { fromFEN } from "./fenPGN";

class Game {
  board: Board
  turn: Color = Color.White
  result: string = ''
  engineColors: Color[]
  halfMoves: number = 0
  moveNumber: number = 1

  /**
   * A game of chess between two players or computers. If both `pgn` and
   * `fen` are provided, `fen` will be used because it is faster
   * @param pgn the starting position as a PGN
   * @param fen the starting position as a FEN
   */
  constructor(pgn?: string, fen?: string) {
    if (typeof fen !== 'undefined') {
      this.board = new Board()
      fromFEN(fen, this)
    } else {
      this.board = new Board(pgn)
      if (this.board.movePointer >= 0) {
        this.turn = (
          +!this.board.lastMove.pieceMoved.color
        )

        let moveInd = this.board.movePointer
        while (moveInd >= 0) {
          const m = this.board.movesMade[moveInd--]
          if (m.pieceMoved instanceof Pawn || m.captured !== null) {
            break
          }
        }
        this.halfMoves = this.board.movePointer - moveInd - 1

        this.moveNumber = 1 + Math.floor(this.board.movesMade.length / 2)
      }
    }
    this._setResult()

    this.engineColors = []
  }

  /**
   * Returns whether this move resets the half move counter
   * @param from where the piece moved from
   * @param to where the piece moved to
   * @returns whether it resets the half move counter
   */
  protected _resetHalfMoves(from: string, to: string): boolean {
    return (
      this.board.pieceAt(to) !== null ||
      this.board.pieceAt(from) instanceof Pawn
    )
  }

  /**
   * Tries to move the piece at `from` to `to`. If the move is not possible
   * or legal, this function does nothing. After the move, checks if the
   * game is over
   * @param from the square of the piece to move
   * @param to the square to move the piece to
   * @param promoType what kind of piece to promote to
   */
  playMove(from: string, to: string, promoType?: PieceT) {
    const moving = this.board.pieceAt(from)
    if (
      this.result === '' && 
      moving !== null && 
      moving.color === this.turn &&
      moving.legalMoves().has(to)
    ) {
      if (this._resetHalfMoves(from, to)) {
        this.halfMoves = 0
      } else {
        this.halfMoves++
      }

      if (this.turn === Color.Black) {
        this.moveNumber++
      }

      this.board.movePiece(from, to, promoType)
      this.turn = +!this.turn
      this._setResult()
    }
  }

  /**
   * Updates the result of the game based on the current board state. 
   * Assumes `this.turn` is accurate
   */
  protected _setResult() {
    if (!this.board.canMove(this.turn)) {
      if (this.board.isInCheck(this.turn)) {
        this.result = this.turn === Color.White ? '0-1' : '1-0'
      } else {
        this.result = '1/2-1/2'
      }
    }
  }
}

export default Game
