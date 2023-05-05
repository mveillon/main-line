import { Piece } from "./Piece";

class Knight extends Piece {
    readonly whiteEmoji: string = '♘'
    readonly blackEmoji: string = '♞'

    legalMovesNoChecks(): Set<string> {
        const direcs: [number, number][] = [
            [ 1,  2],
            [ 1, -2],
            [-1,  2],
            [-1, -2],
            [ 2,  1],
            [ 2, -1],
            [-2,  1],
            [-2, -1]
        ]

        return this._finiteMoves(direcs)
    }
}

export default Knight
