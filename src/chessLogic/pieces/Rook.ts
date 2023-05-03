import Piece from "./Piece";

class Rook extends Piece {
    readonly whiteEmoji: string = '♖'
    readonly blackEmoji: string = '♜'

    legalMoves(): Set<string> {
        return new Set()
    }
}

export default Rook
