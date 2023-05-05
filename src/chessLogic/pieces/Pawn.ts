import { addArrays } from "../../utils/numJS";
import Color from "../Color";
import { indicesToNotation, notationToIndices, indexToLetter } from "../notationIndices";
import { Piece } from "./Piece";

class Pawn extends Piece {
    readonly whiteEmoji: string = '♙'
    readonly blackEmoji: string = '♟'

    // assumes the pawn is not on the opposite rank i.e. if it can promote, 
    // it already has
    legalMovesNoChecks(): Set<string> {
        const res = new Set<string>()
        const movesTowards = this.color === Color.White ? 1 : -1
        const current = notationToIndices(this.coords)

        const oneUp = (addArrays(current, [movesTowards, 0]) as [number, number])
        const oneUpNotation = indicesToNotation(...oneUp)

        if (this._board.pieceAt(oneUpNotation) === null) {
            res.add(oneUpNotation)

            if (!this.hasMoved) {
                const twoUp = (
                    addArrays(current, [movesTowards * 2, 0]) as [number, number]
                )
                const twoUpNotation = indicesToNotation(...twoUp)
    
                if (this._board.pieceAt(twoUpNotation) === null) {
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

                const epRank = this.color === Color.White ? '5' : '4'
                if (this.coords[1] === epRank) {
                    const opStartRank = (
                        this.color === Color.White ? '7' : '2'
                    )
                    const lastMove = (
                        this._board.movesMade[this._board.movesMade.length - 1]
                    )

                    const canPassant = (
                        lastMove.to === notation[0] + epRank &&
                        lastMove.from === notation[0] + opStartRank &&
                        this._board.pieceAt(lastMove.to) instanceof Pawn
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
