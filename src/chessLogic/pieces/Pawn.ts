import { addArrays } from "../../utils/numJS";
import COLOR from "../Color";
import { indicesToNotation, notationToIndices } from "../notationIndices";
import { Piece, PieceT } from "./Piece";

class Pawn extends Piece {
  readonly blackEmoji = '♙'
  readonly whiteEmoji = '♟'
  readonly type: PieceT = Pawn

  // assumes the pawn is not on the opposite rank i.e. if it can promote, 
  // it already has
  legalMovesNoChecks(): Set<string> {
    const res = new Set<string>()
    const movesTowards = this.color === COLOR.WHITE ? 1 : -1
    const current = notationToIndices(this.coords)

    const oneUp = (addArrays(current, [movesTowards, 0]) as [number, number])
    const oneUpNotation = indicesToNotation(...oneUp)

    if (
      !this._board.blockedOOB(oneUp, this.color) && 
      this._board.pieceAt(oneUpNotation) === null
    ) {
      res.add(oneUpNotation)

      if (!this.hasMoved) {
        const twoUp = (
          addArrays(current, [movesTowards * 2, 0]) as [number, number]
        )
        const twoUpNotation = indicesToNotation(...twoUp)
  
        if (
          !this._board.blockedOOB(twoUp, this.color) &&
          this._board.pieceAt(twoUpNotation) === null
        ) {
          res.add(twoUpNotation)
        }
      }
    }

    const takeDirecs: [number, number][] = [
      [movesTowards,  1],
      [movesTowards, -1]
    ]
    for (const d of takeDirecs) {
      const newPos = (addArrays(current, d) as [number, number])
      if (!this._board.blockedOOB(newPos, this.color)) {
        const notation = indicesToNotation(...newPos)
        const p = this._board.pieceAt(notation)

        if (p !== null && p.color !== this.color) {
          res.add(notation)
        }

        const epRank = this.color === COLOR.WHITE ? '5' : '4'
        if (this.coords[1] === epRank) {
          const opStartRank = (
            this.color === COLOR.WHITE ? '7' : '2'
          )
          const lastMove = this._board.lastMove

          const canPassant = (
            typeof lastMove !== 'undefined' && 
            lastMove.to === notation[0] + epRank &&
            lastMove.from === notation[0] + opStartRank &&
            lastMove.pieceMoved instanceof Pawn
          )

          if (canPassant) {
            res.add(notation)
          }
        }
      }
    }

    return res
  }
}

export default Pawn
