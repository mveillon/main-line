import Color from "../Color";
import { Piece } from "./Piece";
import Rook from "./Rook";

class King extends Piece {
  readonly blackEmoji: string = '♔'
  readonly whiteEmoji: string = '♚'

  legalMovesNoChecks(): Set<string> {
    const direcs: [number, number][] = [
      [ 1,  0],
      [-1,  0],
      [ 0,  1],
      [ 0, -1],
      [-1, -1],
      [-1,  1],
      [ 1,  1],
      [ 1, -1]
    ]

    return this._finiteMoves(direcs)
  }

  legalMoves(): Set<string> {
    const res = super.legalMoves()
    const rank = this.color === Color.White ? '1' : '8'

    if (!this.hasMoved) {
      const shortRook = this._board.pieceAt('h' + rank)
      const canShortCastle = (
        shortRook instanceof Rook &&
        !shortRook.hasMoved &&
        this._board.pieceAt('f' + rank) === null &&
        this._board.pieceAt('g' + rank) === null &&
        !this._board.putsKingInCheck('e' + rank, 'f' + rank) &&
        !this._board.putsKingInCheck('e' + rank, 'g' + rank) &&
        !this._board.putsKingInCheck(
          'h' + rank, 
          'g' + rank
        ) // is the king in check now?
      )
      if (canShortCastle) {
        res.add('g' + rank)
      }

      const longRook = this._board.pieceAt('a1')
      const canLongCastle = (
        longRook instanceof Rook &&
        !longRook.hasMoved &&
        this._board.pieceAt('b' + rank) === null &&
        this._board.pieceAt('c' + rank) === null &&
        this._board.pieceAt('d' + rank) === null &&
        !this._board.putsKingInCheck('e' + rank, 'd' + rank) &&
        !this._board.putsKingInCheck('e' + rank, 'c' + rank) &&
        !this._board.putsKingInCheck(
          'a' + rank, 
          'b' + rank
        ) // is the king in check now?
      )
      if (canLongCastle) {
        res.add('c' + rank)
      }
    }

    return res
  }
}

export default King
