import Piece from "./Piece";

class Bishop extends Piece {
    readonly whiteEmoji: string = '♗' 
    readonly blackEmoji: string = '♝'

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default Bishop

