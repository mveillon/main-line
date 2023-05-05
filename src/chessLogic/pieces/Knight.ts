import { Piece } from "./Piece";

class Knight extends Piece {
  readonly blackEmoji: string = '♘'
  readonly whiteEmoji: string = '♞'

  legalMovesNoChecks(): Set<string> {
    const direcs: [number, number][] = [
      [ 1,  2],
      [ 1, -2],
      [-1,  2],
      [-1, -2],
      [ 2,  1],
      [ 2, -1],
      [-2,  1],
      [-2, -1]
    ]

    return this._finiteMoves(direcs)
  }
}

export default Knight
