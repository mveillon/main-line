import { Board } from "../../chessLogic/Board";
import Color from "../../chessLogic/Color";
import { notationToIndices } from "../../chessLogic/notationIndices";
import Bishop from "../../chessLogic/pieces/Bishop";
import King from "../../chessLogic/pieces/King";
import Knight from "../../chessLogic/pieces/Knight";
import Pawn from "../../chessLogic/pieces/Pawn";
import { Piece } from "../../chessLogic/pieces/Piece";
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
    expect((b.pieceAt(`${file}1`) as Piece).color).toBe(Color.White)
    expect(b.pieceAt(`${file}2`)).toBeInstanceOf(Pawn)
    expect((b.pieceAt(`${file}2`) as Piece).color).toBe(Color.White)

    expect((b.pieceAt(`${file}8`) as Piece).color).toBe(Color.Black)
    expect(b.pieceAt(`${file}7`)).toBeInstanceOf(Pawn)
    expect((b.pieceAt(`${file}7`) as Piece).color).toBe(Color.Black)
  }
})

test('movePiece', () => {
  const b = new Board()

  b.movePiece('e2', 'e4')
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect((b.pieceAt('e4') as Piece).coords).toBe('e4')
  expect((b.pieceAt('e4') as Piece).color).toBe(Color.White)

  b.movePiece('e7', 'e5')
  expect(b.pieceAt('e7')).toBeNull()
  expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
  expect((b.pieceAt('e5') as Piece).coords).toBe('e5')
  expect((b.pieceAt('e5') as Piece).color).toBe(Color.Black)
})

test('blockedOOB', () => {
  const b = new Board()
  expect(b.blockedOOB(notationToIndices('a1'), Color.White)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('h1'), Color.White)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('a1'), Color.Black)).toBeFalsy()
  expect(b.blockedOOB(notationToIndices('h1'), Color.Black)).toBeFalsy()

  expect(b.blockedOOB(notationToIndices('a8'), Color.Black)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('h8'), Color.Black)).toBeTruthy()
  expect(b.blockedOOB(notationToIndices('a8'), Color.White)).toBeFalsy()
  expect(b.blockedOOB(notationToIndices('h8'), Color.White)).toBeFalsy()

  expect(b.blockedOOB([-1, 7], Color.White)).toBeTruthy()
  expect(b.blockedOOB([-1, 7], Color.Black)).toBeTruthy()
  expect(b.blockedOOB([8, 0], Color.White)).toBeTruthy()
  expect(b.blockedOOB([8, 0], Color.Black)).toBeTruthy()
  expect(b.blockedOOB([0, -1], Color.White)).toBeTruthy()
  expect(b.blockedOOB([0, -1], Color.Black)).toBeTruthy()
  expect(b.blockedOOB([0, 8], Color.White)).toBeTruthy()
  expect(b.blockedOOB([0, 8], Color.Black)).toBeTruthy()
})
