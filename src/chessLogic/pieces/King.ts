import Piece from "./Piece";

class King extends Piece {
    readonly whiteEmoji: string = '♔'
    readonly blackEmoji: string = '♚'
    hasMoved: boolean = false

    // TODO : override legalMoves method and put castling in that
    legalMovesNoChecks(): Set<string> {
        const direcs: [number, number][] = [
            [ 1,  0],
            [-1,  0],
            [ 0,  1],
            [ 0, -1],
            [-1, -1],
            [-1,  1],
            [ 1,  1],
            [ 1, -1]
        ]

        return this._finiteMoves(direcs)
    }
}

export default King
