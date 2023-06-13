import Game from "../../chessLogic/Game"
import { toFEN, fromFEN } from "../../chessLogic/fenPGN"
import { Board } from "../../chessLogic/Board"
import COLOR from "../../chessLogic/Color"
import King from "../../chessLogic/pieces/King"
import Pawn from "../../chessLogic/pieces/Pawn"
import { all } from "../../utils/numJS"
import Rook from "../../chessLogic/pieces/Rook"

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
    },
    {
      fen: 'rnbq1bnr/ppppkppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR w - - 2 3',
      pgn: `
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        
        1. e4 e5 2. Ke2 Ke7 *
      `
    }
  ]

  for (const { fen, pgn } of fens) {
    compareFENtoPGN(fen, pgn)
  }
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

test('fen details', () => {
  const fen = `rnbqkbnr/pp2pppp/8/2ppP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3`
  const g = new Game(undefined, fen)
  expect(g.turn).toBe(COLOR.WHITE)

  const canCastle = (board: Board, color: COLOR): boolean => {
    return (
      !board.findPieces(King, color)[0].hasMoved &&
      (
        all(board.findPieces(Rook, color).map(r => !r.hasMoved))
      )
    )
  }
  expect(canCastle(g.board, COLOR.WHITE)).toBeTruthy()
  expect(canCastle(g.board, COLOR.BLACK)).toBeTruthy()

  expect(g.board.pieceAt('e5')).toBeInstanceOf(Pawn)
  expect(g.board.pieceAt('d6')).toBeNull()
  expect(g.board.pieceAt('d5')).toBeInstanceOf(Pawn)
  expect(g.board.pieceAt('e5')?.legalMoves()).toContain('d6')
  expect(g.board.backwardOneMove()).toBeTruthy()
  expect(g.board.pieceAt('d7')).toBeInstanceOf(Pawn)
  expect(g.board.pieceAt('d5')).toBeNull()

  const fen2 = 'rnbqkbnr/pp2pppp/8/2ppP3/8/5P2/PPPP2PP/RNBQKBNR b KQkq - 0 3'
  const g2 = new Game(undefined, fen2)
  expect(g2.turn).toBe(COLOR.BLACK)
  expect(canCastle(g2.board, COLOR.WHITE)).toBeTruthy()
  expect(canCastle(g2.board, COLOR.WHITE)).toBeTruthy()

  expect(g2.board.backwardOneMove()).toBeFalsy()

  const noCastleFen = 'rnbq1bnr/pp1kpppp/8/2ppP3/8/5P2/PPPPK1PP/RNBQ1BNR b - - 2 4'
  const noCastle = new Game(undefined, noCastleFen)

  const cantCastle = (board: Board, color: COLOR): boolean => {
    return (
      board.findPieces(King, color)[0].hasMoved ||
      (
        all(board.findPieces(Rook, color).map(r => r.hasMoved))
      )
    )
  }

  expect(cantCastle(noCastle.board, COLOR.WHITE)).toBeTruthy()
  expect(cantCastle(noCastle.board, COLOR.BLACK)).toBeTruthy()

  const blackNoCastleFen = 'rnbq1bnr/pp1kpppp/8/2ppP3/8/5P2/PPPP2PP/RNBQKBNR w KQ - 1 4'
  const blackNoCastle = new Game(undefined, blackNoCastleFen)

  expect(cantCastle(blackNoCastle.board, COLOR.BLACK))
  expect(canCastle(blackNoCastle.board, COLOR.WHITE))
})

test('invalid fen', () => {
  expect(() => new Game(undefined, '')).toThrow()
  expect(() => new Game(
    undefined, 
    'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2'
  )).toThrow()
  expect(() => new Game(
    undefined,
    'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3 4'
  )).toThrow()
})
