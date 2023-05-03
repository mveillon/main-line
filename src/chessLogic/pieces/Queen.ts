import Piece from "./Piece";

class Queen extends Piece {
    readonly whiteEmoji: string = '♕'
    readonly blackEmoji: string = '♛'

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default Queen
