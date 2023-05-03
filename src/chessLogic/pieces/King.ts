import Piece from "./Piece";

class King extends Piece {
    readonly whiteEmoji: string = '♔'
    readonly blackEmoji: string = '♚'
    hasMoved: boolean = false

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default King
