import Piece from "./Piece";

class Rook extends Piece {
    readonly whiteEmoji: string = '♖'
    readonly blackEmoji: string = '♜'
    hasMoved: boolean = false

    legalMovesNoChecks(): Set<string> {
        const direcs: [number, number][] = [
            [ 1,  0],
            [-1,  0],
            [ 0,  1],
            [ 0, -1]
        ]

        return this._infiniteMoves(direcs)
    }
}

export default Rook
