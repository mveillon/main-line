import COLOR from "../../chessLogic/Color";
import Game from "../../chessLogic/Game";

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

test('side effects', () => {
  const g = new Game()
  expect(g.turn).toBe(COLOR.WHITE)
  expect(g.halfMoves).toBe(0)
  expect(g.moveNumber).toBe(1)

  g.playMove('e2', 'e4')
  expect(g.turn).toBe(COLOR.BLACK)
  expect(g.halfMoves).toBe(0)
  expect(g.moveNumber).toBe(1)
  
  g.playMove('g8', 'f6')
  expect(g.turn).toBe(COLOR.WHITE)
  expect(g.halfMoves).toBe(1)
  expect(g.moveNumber).toBe(2)

  g.playMove('d2', 'd4')
  expect(g.turn).toBe(COLOR.BLACK)
  expect(g.halfMoves).toBe(0)
  expect(g.moveNumber).toBe(2)
})
