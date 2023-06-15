import { Piece, PieceT } from "./Piece";

class Bishop extends Piece {
  readonly blackEmoji = '♗' 
  readonly whiteEmoji = '♝'
  readonly type: PieceT = Bishop

  legalMovesNoChecks(): Set<string> {
    const direcs: [number, number][] = [
      [-1, -1],
      [-1,  1],
      [ 1,  1],
      [ 1, -1]
    ]

    return this._infiniteMoves(direcs)
  }
}

export default Bishop

