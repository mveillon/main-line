import Piece from "./Piece";

class Knight extends Piece {
    readonly whiteEmoji: string = '♘'
    readonly blackEmoji: string = '♞'

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default Knight
