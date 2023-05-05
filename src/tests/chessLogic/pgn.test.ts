import { Board } from "../../chessLogic/Board";
import { setUpBoard } from "./parser.test";

test('scholars mate 1', () => {
    const pgn = `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "1-0"]
        
        1. e4 f6 2. d4 g5 3. Qh5# 1-0
    `

    const b = new Board(pgn)

    const b2 = setUpBoard([
        '1. e4 f6',
        '2. d4 g5',
        '3. Qh5#'
    ])

    expect(b.sameBoard(b2)).toBeTruthy()
})

test('scholars mate 2', () => {
    const pgn = `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "1-0"]
        
        1. e4 f6 2. d4 g5 (what the fuck was this move) 3. Qh5# 1-0
    `

    const b = new Board(pgn)

    const b2 = setUpBoard([
        '1. e4 f6',
        '2. d4 g5',
        '3. Qh5#'
    ])

    expect(b.sameBoard(b2)).toBeTruthy()
})

test('draw', () => {
    const pgn = `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "1/2-1/2"]

        1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. Ng1 Ng8 1/2-1/2
    `

    const b = new Board(pgn)
    const b2 = setUpBoard([
        '1. Nf3 Nf6',
        '2. Ng1 Ng8',
        '3. Nf3 Nf6',
        '4. Ng1 Ng8'
    ])

    expect(b.sameBoard(b2)).toBeTruthy()
})
