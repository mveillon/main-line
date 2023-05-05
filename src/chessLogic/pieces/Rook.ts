import { Piece } from "./Piece";

class Rook extends Piece {
  readonly blackEmoji: string = '♖'
  readonly whiteEmoji: string = '♜'

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
