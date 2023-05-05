import { Piece } from "./Piece";

class Bishop extends Piece {
  readonly blackEmoji: string = '♗' 
  readonly whiteEmoji: string = '♝'

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

