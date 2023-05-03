import Color from "../Color"
import { Board } from "../Board"
import { indicesToNotation, notationToIndices } from "../notationIndices";
import { addArrays } from "../../utils/numJS";

abstract class Piece {
    readonly color: Color
    coords: string
    readonly whiteEmoji: string = ''
    readonly blackEmoji: string = ''
    protected _board: Board

    constructor(_color: Color, _coords: string, board: Board) {
        this.color = _color
        this.coords = _coords
        this._board = board
    }

    /**
     * Finds all moves the piece can go to, without checking if
     * the move will put the king in check
     * @returns a set of all available moves
     */
    abstract legalMovesNoChecks(): Set<string>;

    /**
     * Pieces that move in infinite straight lines (bishops, rooks, queens)
     * can use this helper method to find their legal moves just by providing
     * in which directions the piece can move
     * @param direcs direction vectors that represent which ways the piece can move
     * @returns all possible moves the piece can make not counting checks
     */
    protected _straightLineMoves(direcs: [number, number][]): Set<string> {
        const res: Set<string> = new Set()
        const current = notationToIndices(this.coords)

        for (const d of direcs) {
            let checking = (addArrays(current, d) as [number, number])
            while (!this._board.blockedOOB(checking, this.color)) {
                const notation = indicesToNotation(...checking)
                res.add(notation)

                const p = this._board.pieceAt(notation)
                if (p !== null && p.color !== this.color) {
                    break
                }
                checking = (addArrays(checking, d) as [number, number])
            }
            
        }
        res.delete(indicesToNotation(...current))

        return res
    }

    /**
     * Pieces that move only once towards a given direction (kings, knights)
     * can use this helper function to find all their moves
     * @param direcs which directions the piece moves in
     * @returns all the piece's legal moves, not looking for checks
     */
    protected _finiteMoves(direcs: [number, number][]): Set<string> {
        const res = new Set<string>()

        const current = notationToIndices(this.coords)

        for (const d of direcs) {
            const newPos = addArrays(current, d) as [number, number]
            if (!this._board.blockedOOB(newPos, this.color)) {
                res.add(indicesToNotation(...newPos))
            }
        }

        return res
    }

    toString() {
        const cStr = this.color === Color.White ? 'White' : 'Black'
        return `${cStr} ${this.whiteEmoji} at ${this.coords}`
    }
}

export default Piece;