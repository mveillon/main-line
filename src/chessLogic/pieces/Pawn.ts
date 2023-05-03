import { addArrays } from "../../utils/numJS";
import Color from "../Color";
import { indicesToNotation, notationToIndices } from "../notationIndices";
import Piece from "./Piece";

class Pawn extends Piece {
    readonly whiteEmoji: string = '♙'
    readonly blackEmoji: string = '♟'
    hasMoved = false

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
            const twoUp = (addArrays(current, [movesTowards * 2, 0]) as [number, number])
            const twoUpNotation = indicesToNotation(...twoUp)

            if (!this.hasMoved && this._board.pieceAt(twoUpNotation) === null) {
                res.add(twoUpNotation)
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
            }
        }

        // TODO : add En Passant

        return res
    }

    /**
     * Promotes the pawn into whatever piece the player chooses
     * TODO : write me!
     */
    promote() {
        
    }
}

export default Pawn
