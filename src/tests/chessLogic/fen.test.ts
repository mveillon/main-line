import Game from "../../chessLogic/Game";

const compareFENtoPGN = (fen: string, pgn: string) => {
  expect((new Game(pgn)).toFEN()).toBe(fen)
}

test('starting position', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  expect(new Game().toFEN()).toBe(fen)
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
