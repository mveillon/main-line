import Piece from "./pieces/Piece"

class Board {
    protected _board: (Piece | null)[][]

    constructor(pgn?: string) {
        this._board = []
    }

    toString(): string {
        const line: string = ' - - - - - - - - '
        let rows: string[] = [line]
        for (const row of this._board) {
            let current: string[] = ['|']
            for (const square of row) {
                if (square === null) {
                    current.push(' ')
                } else {
                    current.push(square.letter)
                }
                current.push('|')
            }
            rows.push(current.join(''))
            rows.push(line)
        }
        return rows.join('\n')
    }
}

export default Board;