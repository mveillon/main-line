import { Board } from "../../chessLogic/Board";
import COLOR from "../../chessLogic/Color";
import Game from "../../chessLogic/Game";
import { notationToIndices } from "../../chessLogic/notationIndices";
import Bishop from "../../chessLogic/pieces/Bishop";
import King from "../../chessLogic/pieces/King";
import Knight from "../../chessLogic/pieces/Knight";
import Pawn from "../../chessLogic/pieces/Pawn";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";

test('starting position', () => {
  const b = new Board()
  const files = 'abcdefgh'

  expect(b.pieceAt('a1')).toBeInstanceOf(Rook)
  expect(b.pieceAt('b1')).toBeInstanceOf(Knight)
  expect(b.pieceAt('c1')).toBeInstanceOf(Bishop)
  expect(b.pieceAt('d1')).toBeInstanceOf(Queen)
  expect(b.pieceAt('e1')).toBeInstanceOf(King)
  expect(b.pieceAt('f1')).toBeInstanceOf(Bishop)
  expect(b.pieceAt('g1')).toBeInstanceOf(Knight)
  expect(b.pieceAt('h1')).toBeInstanceOf(Rook)

  for (const file of files) {
    expect(b.pieceAt(`${file}1`)?.color).toBe(COLOR.WHITE)
    expect(b.pieceAt(`${file}2`)).toBeInstanceOf(Pawn)
    expect(b.pieceAt(`${file}2`)?.color).toBe(COLOR.WHITE)

    expect(b.pieceAt(`${file}8`)?.color).toBe(COLOR.BLACK)
    expect(b.pieceAt(`${file}7`)).toBeInstanceOf(Pawn)
    expect(b.pieceAt(`${file}7`)?.color).toBe(COLOR.BLACK)
  }

  expect(typeof b.pieceAt('h1')?.toString()).toBe("string")
  expect(typeof b.pieceAt('h8')?.toString()).toBe('string')
})

test('movePiece', () => {
  const b = new Board()

  b.movePiece('e2', 'e4')
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e4')?.coords).toBe('e4')
  expect(b.pieceAt('e4')?.color).toBe(COLOR.WHITE)

  b.movePiece('e7', 'e5')
  expect(b.pieceAt('e7')).toBeNull()
  expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e5')?.coords).toBe('e5')
  expect(b.pieceAt('e5')?.color).toBe(COLOR.BLACK)
})

test('blockedOOB', () => {
  const b = new Board()
  expect(b.blockedOOB(notationToIndices('a1'), COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('h1'), COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('a1'), COLOR.BLACK)).toBeFalsy()
  expect(b.blockedOOB(notationToIndices('h1'), COLOR.BLACK)).toBeFalsy()

  expect(b.blockedOOB(notationToIndices('a8'), COLOR.BLACK)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('h8'), COLOR.BLACK)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('a8'), COLOR.WHITE)).toBeFalsy()
  expect(b.blockedOOB(notationToIndices('h8'), COLOR.WHITE)).toBeFalsy()

  expect(b.blockedOOB([-1, 7], COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB([-1, 7], COLOR.BLACK)).toBeTruthy()
  expect(b.blockedOOB([8, 0], COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB([8, 0], COLOR.BLACK)).toBeTruthy()
  expect(b.blockedOOB([0, -1], COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB([0, -1], COLOR.BLACK)).toBeTruthy()
  expect(b.blockedOOB([0, 8], COLOR.WHITE)).toBeTruthy()
  expect(b.blockedOOB([0, 8], COLOR.BLACK)).toBeTruthy()
})

test('errors', () => {
  const b = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 e5 2. Nf3 Nf6 3. Bc4 *
  `)

  expect(() => { b.movePiece('e1', 'O-O') }).toThrow()
  expect(() => { b.movePiece('f1', 'c4') }).toThrow()
  b.movePiece('h1', 'f1')
  expect(() => { b.movePiece('e1', 'g1') }).toThrow()

  const b2 = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 g6 3. fxg6 Nf6 4. gxh7 Rg8 *
  `)

  expect(() => { b2.movePiece('h7', 'g8') }).toThrow()
  expect(() => b2.putsKingInCheck('g6', 'g7')).toThrow()
})

test('undo', () => {
  const b = new Board()
  expect(() => { b.undoLastMove() }).toThrow()

  b.movePiece('e2', 'e4')
  b.undoLastMove()
  expect(b.pieceAt('e4')).toBeNull()
  expect(b.pieceAt('e2')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e2')?.hasMoved).toBeFalsy()
  expect(b.pieceAt('e2')?.coords).toBe('e2')

  b.movePiece('e2', 'e4')
  b.movePiece('d7', 'd5')
  b.movePiece('e4', 'd5')
  b.undoLastMove()

  expect(b.pieceAt('d5')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('d5')?.color).toBe(COLOR.BLACK)
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e4')?.color).toBe(COLOR.WHITE)
  expect(b.pieceAt('d5')?.hasMoved).toBeTruthy()
  expect(b.pieceAt('e4')?.hasMoved).toBeTruthy()
  expect(b.pieceAt('d5')?.coords).toBe('d5')
  expect(b.pieceAt('e4')?.coords).toBe('e4')

  b.movePiece('d5', 'd4')
  b.movePiece('c2', 'c4')
  b.movePiece('d4', 'c3')
  b.undoLastMove()
  
  expect(b.pieceAt('d4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('d4')?.coords).toBe('d4')
  expect(b.pieceAt('d4')?.color).toBe(COLOR.BLACK)
  expect(b.pieceAt('d4')?.hasMoved).toBeTruthy()
  expect(b.pieceAt('c4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('c4')?.coords).toBe('c4')
  expect(b.pieceAt('c4')?.color).toBe(COLOR.WHITE)
  expect(b.pieceAt('c4')?.hasMoved).toBeTruthy()

  const b2 = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 d5 2. Nf3 Nc6 3. Bd3 Bg4 4. Nc3 Qd6 *
  `)

  b2.movePiece('e1', 'g1')
  b2.undoLastMove()

  expect(b2.pieceAt('e1')).toBeInstanceOf(King)
  expect(b2.pieceAt('e1')?.hasMoved).toBeFalsy()
  expect(b2.pieceAt('h1')).toBeInstanceOf(Rook)
  expect(b2.pieceAt('h1')?.hasMoved).toBeFalsy()

  b2.movePiece('e8', 'c8')
  b2.undoLastMove()

  expect(b2.pieceAt('e8')).toBeInstanceOf(King)
  expect(b2.pieceAt('e8')?.hasMoved).toBeFalsy()
  expect(b2.pieceAt('a8')).toBeInstanceOf(Rook)
  expect(b2.pieceAt('a8')?.hasMoved).toBeFalsy()

  const promotion = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 e6 3. fxe6 Nf6 4. exd7+ Kf7 *
  `)

  promotion.movePiece('d7', 'c8', Knight)
  promotion.undoLastMove()

  expect(promotion.pieceAt('c8')).toBeInstanceOf(Bishop)
  expect(promotion.pieceAt('d7')).toBeInstanceOf(Pawn)
})

test('skipping', () => {
  const b = new Board()
  expect(b.forwardOneMove()).toBeFalsy()
  expect(b.sameBoard(new Board())).toBeTruthy()
  expect(b.backwardOneMove()).toBeFalsy()
  expect(b.sameBoard(new Board())).toBeTruthy()

  b.movePiece('e2', 'e4')
  b.movePiece('d7', 'd5')

  expect(b.backwardOneMove()).toBeTruthy()
  expect(b.pieceAt('d5')).toBeNull()
  expect(b.pieceAt('d7')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)

  expect(b.backwardOneMove()).toBeTruthy()
  expect(b.pieceAt('e4')).toBeNull()
  expect(b.pieceAt('e2')).toBeInstanceOf(Pawn)

  expect(b.forwardOneMove()).toBeTruthy()
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('d5')).toBeNull()

  expect(b.forwardOneMove()).toBeTruthy()
  expect(b.pieceAt('d5')).toBeInstanceOf(Pawn)
})

test('over skipping', () => {
  const pgn = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. d4 d5 2. Bf4 Bg4 3. Nf3 c5 4. e3 *
  `
  const b = new Board(pgn)

  expect(b.movesMade.length).toBe(7)

  expect(b.pieceAt('e3')).toBeInstanceOf(Pawn)
  expect(b.backwardOneMove()).toBeTruthy()
  expect(b.pieceAt('e3')).toBeNull()
  expect(b.pieceAt('e2')).toBeInstanceOf(Pawn)

  expect(b.forwardOneMove()).toBeTruthy()
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('e3')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e3')?.coords).toBe('e3')

  expect(b.movesMade.length).toBe(7)
  expect(b.movePointer).toBe(6)

  for (let i = b.movePointer; i >= 0; i--) {
    expect(b.movePointer).toBe(i)
    expect(b.backwardOneMove()).toBeTruthy()
  }

  expect(b.movePointer).toBe(-1)
  expect(b.backwardOneMove()).toBeFalsy()
  expect(b.sameBoard(new Board())).toBeTruthy()

  for (let i = 0; i < 7; i++) {
    expect(b.forwardOneMove()).toBeTruthy()
    expect(b.movePointer).toBe(i)
  }

  expect(b.pieceAt('e3')).toBeInstanceOf(Pawn)
})

test('fen over skipping', () => {
  const fen = 'rn1qkbnr/pp2pppp/8/2pp4/3P1Bb1/4PN2/PPP2PPP/RN1QKB1R b KQkq - 0 4'
  const g = new Game(undefined, fen)

  expect(g.board.movesMade.length).toBe(0)
  expect(g.board.movePointer).toBe(-1)

  expect(g.board.backwardOneMove()).toBeFalsy()
  expect(g.board.forwardOneMove()).toBeFalsy()

  g.playMove('g4', 'f3')
  expect(g.board.pieceAt('f3')).toBeInstanceOf(Bishop)
  expect(g.board.pieceAt('f3')?.color).toBe(COLOR.BLACK)

  expect(g.board.backwardOneMove()).toBeTruthy()
  expect(g.board.pieceAt('f3')).toBeInstanceOf(Knight)
  expect(g.board.pieceAt('f3')?.color).toBe(COLOR.WHITE)
  expect(g.board.backwardOneMove()).toBeFalsy()

  expect(g.board.forwardOneMove()).toBeTruthy()
  expect(g.board.pieceAt('f3')).toBeInstanceOf(Bishop)
  expect(g.board.pieceAt('f3')?.color).toBe(COLOR.BLACK)

  expect(g.board.backwardOneMove()).toBeTruthy()
  expect(g.board.pieceAt('f3')).toBeInstanceOf(Knight)
  expect(g.board.pieceAt('f3')?.color).toBe(COLOR.WHITE)
  expect(g.board.backwardOneMove()).toBeFalsy()
})
