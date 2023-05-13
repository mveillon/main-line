import { Piece, PieceT } from "./Piece";

class Queen extends Piece {
  readonly blackEmoji: string = '♕'
  readonly whiteEmoji: string = '♛'
  readonly type: PieceT = Queen

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

    return this._infiniteMoves(direcs)
  }
}

export default Queen
