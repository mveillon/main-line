import { Board } from "./Board";
import Color from "./Color";
import King from "./pieces/King";
import Pawn from "./pieces/Pawn";
import { PieceT } from "./pieces/Piece";
import Rook from "./pieces/Rook";
import { pieceToAcronym } from "./parser";

class Game {
  board: Board
  turn: Color = Color.White
  result: string = ''
  engineColors: Color[]

  /**
   * A game of chess between two players or computers
   * @param pgn the starting PGN
   */
  constructor(pgn?: string) {
    this.board = new Board(pgn)
    if (this.board.movesMade.length > 0) {
      this.turn = (
        +!this.board.lastMove.pieceMoved.color
      )
      this._setResult()
    }

    this.engineColors = []
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

  /**
   * Generates a FEN string to describe the board
   * @returns a single line of text that describes the entire position
   */
  toFEN(): string {
    const allRows: string[] = []
    for (let i = this.board.board.length - 1; i >= 0; i--) {
      const row: string[] = []
      let emptySpaces = 0
      for (let j = this.board.board[i].length - 1; j >= 0; j--) {
        const square = this.board.board[i][j]
        if (square === null) {
          emptySpaces++
          if (j === 0) {
            row.push(emptySpaces.toString())
          }
        } else {
          if (emptySpaces > 0) {
            row.push(emptySpaces.toString())
            emptySpaces = 0
          }
          let a = pieceToAcronym(square.type)
          if (square instanceof Pawn) {
            a = 'p'
          }
          if (square.color === Color.Black) {
            row.push(a)
          } else {
            row.push(a.toUpperCase())
          }
        }
      }
      allRows.push(row.join(''))
    }

    const parts = [allRows.join('/')]
    parts.push(this.turn === Color.White ? 'w' : 'b')

    const castling: string[] = []
    for (const c of [Color.White, Color.Black]) {
      const king = this.board.findPieces(King, c)[0]
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
        ]
        for (const rook of rookFiles) {
          const r = this.board.pieceAt(rook.file + king.coords[1])
          if (r instanceof Rook && r.color === c && !r.hasMoved) {
            castling.push(
              c === Color.White ? rook.meaning.toUpperCase() : rook.meaning
            )
          }
        }
      }
    }
    parts.push(castling.join(''))

    if (this.board.movesMade.length === 0) {
      parts.push('-')
    } else {
      const lastMove = this.board.lastMove
      const ranks = [parseInt(lastMove.from[1]), parseInt(lastMove.to[1])]
      const isTarget = (
        lastMove.pieceMoved instanceof Pawn &&
        !lastMove.hadMoved &&
        Math.abs(ranks[0] - ranks[1]) === 2
      )
      if (isTarget) {
        parts.push(
          lastMove.to[0] +
          (Math.round(ranks[0] + ranks[1]) / 2).toString()
        )
      } else {
        parts.push('-')
      }
    }
    
    let halfMoves = 0
    for (let i = this.board.movesMade.length - 1; i >= 0; i--) {
      const move = this.board.movesMade[i]
      if (move.captured !== null || move.pieceMoved instanceof Pawn) {
        break
      } else {
        halfMoves++
      }
    }

    parts.push(halfMoves.toString())
    parts.push((1 + Math.floor(this.board.movesMade.length / 2)).toString())

    return parts.join(' ')
  }
}

export default Game
