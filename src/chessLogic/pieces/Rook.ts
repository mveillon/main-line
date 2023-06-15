import { Piece, PieceT } from "./Piece";

class Rook extends Piece {
  readonly blackEmoji = '♖'
  readonly whiteEmoji = '♜'
  readonly type: PieceT = Rook

  legalMovesNoChecks(): Set<string> {
    const direcs: [number, number][] = [
      [ 1,  0],
      [-1,  0],
      [ 0,  1],
      [ 0, -1]
    ]

    return this._infiniteMoves(direcs)
  }
}

export default Rook
