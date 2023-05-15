import Game from "../../chessLogic/Game";
import { toFEN, fromFEN } from "../../chessLogic/fenPGN";

const compareFENtoPGN = (fen: string, pgn: string) => {
  expect(toFEN(new Game(pgn))).toBe(fen)
  expect((new Game(pgn).board).sameBoard(new Game(undefined, fen).board)).toBeTruthy()
  expect(toFEN(new Game(undefined, fen))).toBe(fen)
}

test('starting position', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const g = new Game()
  expect(toFEN(g)).toBe(fen)

  g.playMove('e3', 'e4')
  expect(toFEN(g)).toBe(fen)
})

test('more fen', () => {
  const fens = [
    {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      pgn: `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        
        1. e4 *
      `
    },

    {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      pgn:`
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        
        1. e4 e5 *
      `
    },
    {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2',
      pgn: `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]

        1. e4 e5 2. Ke2 *
      `
    },
    {
      fen: 'r1bqkr2/pppp1ppp/n4n2/2b1p3/3PP3/3Q1N2/PPP1KPPP/RNB2B1R w q - 5 6',
      pgn: `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        
        1. e4 e5 2. Ke2 Nf6 3. d4 Na6 4. Qd3 Bc5 5. Nf3 Rf8 *
      `
    }
  ]

  for (const { fen, pgn } of fens) {
    compareFENtoPGN(fen, pgn)
  }
})

test('game over', () => {
  const whiteWinsPGN = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1-0"]

    1. e4 e5 2. Qh5 Nf6 3. Bc4 a6 4. Qxf7# 1-0
  `

  const whiteWinsGame = new Game(whiteWinsPGN)
  expect(whiteWinsGame.result).toBe('1-0')

  const blackWinsPGN = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "0-1"]
    
    1. e4 e5 2. Na3 Qh4 3. Nc4 Bc5 4. Na3 Qxf2# 0-1
  `
  const blackWinsGame = new Game(blackWinsPGN)
  expect(blackWinsGame.result).toBe('0-1')

  const stalematePGN = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1/2-1/2"]
    [WhiteElo ""]
    [BlackElo ""]
    [ECO ""]
    
    1. e3 a5 2. Qh5 Ra6 3. Qxa5 h5 4. h4 Rah6 5. Qxc7 f6 6. Qxd7+ Kf7 7. Qxb7 Qd3 8.
    Qxb8 Qh7 9. Qxc8 Kg6 10. Qe6 1/2-1/2
  `
  const stalemateGame = new Game(stalematePGN)
  expect(stalemateGame.result).toBe('1/2-1/2')

  expect(() => new Game(undefined, '')).toThrow()
})

test('fen mid game', () => {
  const g = new Game()
  g.playMove('f2', 'f3')
  g.playMove('e7', 'e5')
  g.playMove('g1', 'g4')

  const fen = toFEN(g)
  g.playMove('d8', 'h5')
  fromFEN(fen, g)

  expect(toFEN(g)).toBe(fen)
})
