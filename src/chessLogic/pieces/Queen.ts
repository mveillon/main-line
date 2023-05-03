import Piece from "./Piece";

class Queen extends Piece {
    readonly whiteEmoji: string = '♕'
    readonly blackEmoji: string = '♛'

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

        return this._straightLineMoves(direcs)
    }
}

export default Queen
