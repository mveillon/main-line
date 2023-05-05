import { Piece } from "./Piece";

class Bishop extends Piece {
    readonly whiteEmoji: string = '♗' 
    readonly blackEmoji: string = '♝'

    legalMovesNoChecks(): Set<string> {
        const direcs: [number, number][] = [
            [-1, -1],
            [-1,  1],
            [ 1,  1],
            [ 1, -1]
        ]

        return this._infiniteMoves(direcs)
    }
}

export default Bishop

