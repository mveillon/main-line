import Piece from "./pieces/Piece"

class Board {
    board: Piece[][]

    constructor(pgn?: string) {
        this.board = []
    }
}

export default Board;