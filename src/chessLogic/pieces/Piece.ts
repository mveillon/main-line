import Color from "../Color"
import { Board } from "../Board"

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

    abstract legalMoves(): Set<string>;
}

export default Piece;