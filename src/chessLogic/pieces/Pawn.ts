import Piece from "./Piece";

class Pawn extends Piece {
    readonly whiteEmoji: string = '♙'
    readonly blackEmoji: string = '♟'
    hasMoved = false

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default Pawn
