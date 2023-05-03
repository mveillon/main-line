import Piece from "./pieces/Piece"
import Color from "./Color"
import startingPosition from "./startingPosition"
import { notationToIndices } from "./notationIndices"
import King from "./pieces/King"
import Pawn from "./pieces/Pawn"

/**
 * An array of pieces. An empty square is `null`. A `BoardT`[0] refers
 * to the 1st rank, and `BoardT`[5][0] represents square h6. In other words,
 * if you print the contents of the board, you will be looking at it from
 * black's perspective
 */
type BoardT = (Piece | null)[][]

class Board {
    protected _board: BoardT
    public get board() : BoardT {
        return this._board
    }

    constructor(pgn?: string) {
        this._board = startingPosition(this)
    }

    toString(): string {
        const line: string = '   --- --- --- --- --- --- --- --- '
        let rows: string[] = [line]
        for (let i = 0; i < this.board.length; i++) {
            const row = this.board[i]
            let current: string[] = [`${i} |`]
            for (const square of row) {
                current.push(' ')
                if (square === null) {
                    current.push(' ')
                } else {
                    if (square.color === Color.White) {
                        current.push(square.whiteEmoji)
                    } else {
                        current.push(square.blackEmoji)
                    }
                }
                current.push(' ')
                current.push('|')
            }
            rows.push(current.join(''))
            rows.push(line)
        }
        rows.push('    h   g   f   e   d   c   b   a  ')
        return rows.join('\n')
    }

    /**
     * Finds the piece at the given coordinates.
     * Coordinates should be in chess notation e.g. h5
     * @param coords the coordinates of the square
     * @returns the piece at that square, or null if the square is empty
     */
    pieceAt(coords: string): Piece | null {
        const [i, j] = notationToIndices(coords)
        return this.board[i][j]
    }

    /**
     * Finds all of `color`'s pieces of the given `pieceType` e.g. all of
     * white's knights
     * TODO : this should be more efficient ideally. Right now it's `O(n^2)`
     * @param pieceType which type the piece is
     * @param color who owns the piece
     * @param file optional param for which file the piece should be on
     * @param rank optional param for which rank the piece should be on
     * @returns a list of all the matching pieces
     */
    findPieces(
        pieceType: typeof Piece, 
        color: Color, 
        file?: string, 
        rank?: string): Piece[] {

        let res: Piece[] = []
        for (const row of this.board) {
            for (const square of row) {
                if (
                    square !== null && 
                    square instanceof pieceType && 
                    square.color == color &&
                    (typeof file === "undefined" || square.coords[0] === file) &&
                    (typeof rank === "undefined" || square.coords[1] === rank)
                ) {
                    res.push(square)
                }
            }
        }

        return res
    }

    /**
     * Moves the piece at `from` to `to`, regardless of whether it's legal
     * @param from the starting square
     * @param to the ending square
     */
    movePiece(from: string, to: string) {
        const [fromI, fromJ] = notationToIndices(from)
        const [toI, toJ] = notationToIndices(to)
        const p = this._board[fromI][fromJ]
        if (p === null) {
            throw new Error(`${from} is an empty square`)
        }

        this._board[toI][toJ] = p
        this._board[fromI][fromJ] = null
        p.coords = to
        if (p instanceof King || p instanceof Pawn) {
            p.hasMoved = true
        }

        if (p instanceof Pawn && (toJ === 0 || toJ === 7)) {
            p.promote()
        }
    }

    /**
     * Checks whether a piece can move to the given square as
     * long as the piece would be able to move there if it was
     * empty. Specifically checks if the player already has a piece
     * there or if the square is out of bounds
     * @param coords the coords to move to
     * @param color whose turn it is
     * @returns whether the square is out of bounds and unoccupied or
     * occupied by an opposing piece. `true` if the square is blocked,
     * `false` otherwise
     */
    blockedOOB(coords: [number, number], color: Color): boolean {
        if (
            coords[0] < 0 || coords[0] >= this._board.length ||
            coords[1] < 0 || coords[1] >= this._board[0].length
        ) {
            return true
        }

        const p = this._board[coords[0]][coords[1]]
        return p !== null && p.color === color
    }
}

export { Board };
export type { BoardT }