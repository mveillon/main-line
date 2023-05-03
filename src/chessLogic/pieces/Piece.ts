import Color from "../Color"
import Board from "../Board"

class Piece {
    readonly color: Color
    coords: string
    readonly letter: string = ''
    protected _board: Board

    constructor(_color: Color, _coords: string, board: Board) {
        this.color = _color
        this.coords = _coords
        this._board = board
    }
}

export default Piece;