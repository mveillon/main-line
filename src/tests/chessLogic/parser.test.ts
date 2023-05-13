import { Board } from "../../chessLogic/Board";
import Color from "../../chessLogic/Color";
import { 
  doubleMove, 
  parseMove, 
  uciToMove, 
  uciToAlgebraic 
} from "../../chessLogic/parser";
import Bishop from "../../chessLogic/pieces/Bishop";
import King from "../../chessLogic/pieces/King";
import Knight from "../../chessLogic/pieces/Knight";
import Pawn from "../../chessLogic/pieces/Pawn";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";

export const setUpBoard = (startingMoves: string[]): Board => {
  const res = new Board()
  for (const move of startingMoves) {
    doubleMove(move, res)
  }
  return res
}

test('scholars mate', () => {
  const b = new Board()

  expect(() => { parseMove('', b) }).toThrow()
  expect(() => { parseMove('[hello]', b) }).toThrow()

  parseMove('1. e4', b)
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e4')?.hasMoved).toBeTruthy()
  expect(b.pieceAt('e4')?.color).toBe(Color.White)
  expect(b.pieceAt('e4')?.coords).toBe('e4')
  expect(b.pieceAt('e8')).toBeInstanceOf(King)

  parseMove('1. ...e5', b)
  expect(b.pieceAt('e7')).toBeNull()
  expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e5')?.color).toBe(Color.Black)
  expect(b.pieceAt('e5')?.coords).toBe('e5')
  expect(b.pieceAt('e8')).toBeInstanceOf(King)

  parseMove('2. Qh5', b)
  expect(b.pieceAt('d1')).toBeNull()
  expect(b.pieceAt('h5')).toBeInstanceOf(Queen)
  expect(b.pieceAt('h5')?.color).toBe(Color.White)

  parseMove('2. ...Nc6', b)
  expect(b.pieceAt('b8')).toBeNull()
  expect(b.pieceAt('c6')).toBeInstanceOf(Knight)
  expect(b.pieceAt('c6')?.color).toBe(Color.Black)

  parseMove('3. Bc4', b)
  expect(b.pieceAt('f1')).toBeNull()
  expect(b.pieceAt('c4')).toBeInstanceOf(Bishop)

  parseMove('3. ...Rb8??', b)
  expect(b.pieceAt('a8')).toBeNull()
  expect(b.pieceAt('b8')).toBeInstanceOf(Rook)

  expect(b.isInCheck(Color.Black)).toBeFalsy()
  parseMove('4. Qxf7#', b)
  expect(b.pieceAt('h5')).toBeNull()
  expect(b.pieceAt('f7')).toBeInstanceOf(Queen)
  expect(b.pieceAt('f7')?.coords).toBe('f7')
  expect(b.pieceAt('f7')?.color).toBe(Color.White)
  expect(b.isInCheck(Color.Black)).toBeTruthy()
})

test('double move', () => {
  const b = new Board()

  doubleMove('1. e4 e5', b)
  expect(b.pieceAt('e2')).toBeNull()
  expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e4')?.hasMoved).toBeTruthy()
  expect(b.pieceAt('e4')?.color).toBe(Color.White)
  expect(b.pieceAt('e4')?.coords).toBe('e4')

  expect(b.pieceAt('e7')).toBeNull()
  expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('e5')?.color).toBe(Color.Black)
  expect(b.pieceAt('e5')?.coords).toBe('e5')

  doubleMove('2. Qh5 Nc6', b)
  expect(b.pieceAt('d1')).toBeNull()
  expect(b.pieceAt('h5')).toBeInstanceOf(Queen)
  expect(b.pieceAt('h5')?.color).toBe(Color.White)

  expect(b.pieceAt('b8')).toBeNull()
  expect(b.pieceAt('c6')).toBeInstanceOf(Knight)
  expect(b.pieceAt('c6')?.color).toBe(Color.Black)

  doubleMove('3. Bc4 Rb8??', b)
  expect(b.pieceAt('f1')).toBeNull()
  expect(b.pieceAt('c4')).toBeInstanceOf(Bishop)

  expect(b.pieceAt('a8')).toBeNull()
  expect(b.pieceAt('b8')).toBeInstanceOf(Rook)

  doubleMove('4. Qxf7#', b)
  expect(b.pieceAt('h5')).toBeNull()
  expect(b.pieceAt('f7')).toBeInstanceOf(Queen)
  expect(b.pieceAt('f7')?.coords).toBe('f7')
  expect(b.pieceAt('f7')?.color).toBe(Color.White)
})

test('captures', () => {
  const b = setUpBoard([
    '1. e4 d5',
    '2. exd5'
  ])

  expect(b.pieceAt('e4')).toBeNull()
  expect(b.pieceAt('d5')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('d5')?.color).toBe(Color.White)

  parseMove('2. ...Qxd5', b)
  expect(b.pieceAt('d8')).toBeNull()
  expect(b.pieceAt('d5')).toBeInstanceOf(Queen)

  doubleMove('3. Nc3 Nf6', b)
  doubleMove('4. Nh3 Nc6', b)
  doubleMove('5. Nf4 Na5', b)
  parseMove('6. Ncxd5!!', b)

  expect(b.pieceAt('d5')).toBeInstanceOf(Knight)
  expect(b.pieceAt('c3')).toBeNull()
  expect(b.pieceAt('f4')).toBeInstanceOf(Knight)
})

test('castling', () => {
  const b = setUpBoard([
    '1. e4 d5',
    '2. Nf3 Nc6',
    '3. Bc4 Bf5',
    '4. Bxd5 Qxd5',
    '5. Ne5 Qxd2',
    '6. Qxd2 Na5',
    '7. f3 Nc6',
    '8. Qc3 Na5',
    '9. O-O'
  ])

  expect(b.pieceAt('e1')).toBeNull()
  expect(b.pieceAt('h1')).toBeNull()
  expect(b.pieceAt('g1')).toBeInstanceOf(King)
  expect(b.pieceAt('f1')).toBeInstanceOf(Rook)

  parseMove('9. ...Nc6', b)
  doubleMove('10. Kf2 Na5', b)

  expect(b.pieceAt('g1')).toBeNull()
  expect(b.pieceAt('f2')).toBeInstanceOf(King)

  doubleMove('11. Ke1 Nc6', b)
  doubleMove('12. Kd1 O-O-O+', b)
  
  expect(b.pieceAt('e8')).toBeNull()
  expect(b.pieceAt('a8')).toBeNull()
  expect(b.pieceAt('c8')).toBeInstanceOf(King)
  expect(b.pieceAt('d8')).toBeInstanceOf(Rook)
})

test('differentiate pieces', () => {
  const b = setUpBoard([
    '1. e4 h5',
    '2. d4 Rh6',
    '3. Nf3 Rc6',
    '4. Be2 Rc4',
    '5. Bf1 a5',
    '6. Be2 Ra6',
    '7. Bf1 Rac6'
  ])

  expect(b.pieceAt('a6')).toBeNull()
  expect(b.pieceAt('c4')).toBeInstanceOf(Rook)
  expect(b.pieceAt('c6')).toBeInstanceOf(Rook)

  parseMove('8. Nbd2', b)
  expect(b.pieceAt('b1')).toBeNull()
  expect(b.pieceAt('d2')).toBeInstanceOf(Knight)
  expect(b.pieceAt('f3')).toBeInstanceOf(Knight)
  parseMove('8. ...R6c5', b)
  expect(b.pieceAt('c6')).toBeNull()
  expect(b.pieceAt('c5')).toBeInstanceOf(Rook)
  expect(b.pieceAt('c4')).toBeInstanceOf(Rook)
})

test('en passant', () => {
  const b = setUpBoard([
    '1. e4 c5',
    '2. e5 d5',
    '3. exd6'
  ])

  expect(b.pieceAt('e5')).toBeNull()
  expect(b.pieceAt('d5')).toBeNull()
  expect(b.pieceAt('d6')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('d6')?.color).toBe(Color.White)

  parseMove('3. ...c4', b)
  doubleMove('4. d4 cxd3', b)
  expect(b.pieceAt('c4')).toBeNull()
  expect(b.pieceAt('d4')).toBeNull()
  expect(b.pieceAt('d3')).toBeInstanceOf(Pawn)
  expect(b.pieceAt('d3')?.color).toBe(Color.Black)
})

test('promotion', () => {
  const b = setUpBoard([
    '1. g4 h5',
    '2. gxh5 g5',
    '3. hxg6 f6',
    '4. g7 Nh6',
    '5. gxh8=Q'
  ])

  const q = b.pieceAt('h8')
  expect(q).toBeInstanceOf(Queen)
  expect(q?.color).toBe(Color.White)
  expect(q?.coords).toBe('h8')

  const b2 = setUpBoard([
    '1. g4 d5',
    '2. e4 dxe4',
    '3. d4 e3', 
    '4. f3 e2',
    '5. Nh3 exd1=Q+'
  ])

  const q2 = b2.pieceAt('d1')
  expect(q2).toBeInstanceOf(Queen)
  expect(q2?.color).toBe(Color.Black)
  expect(q2?.coords).toBe('d1')
})

test('uci', () => {
  expect(uciToMove('e2e4')).toEqual(['e2', 'e4', undefined])
  expect(uciToMove('e7e8q')).toEqual(['e7', 'e8', Queen])
})

test('uci to algebraic', () => {
  const b = new Board()
  expect(() => uciToAlgebraic('e3e4', b)).toThrow()
  expect(uciToAlgebraic('e2e4', b)).toBe('e4')
  expect(uciToAlgebraic('b8c6', b)).toBe('Nc6')

  b.movePiece('e2', 'e4')
  b.movePiece('d7', 'd5')
  expect(uciToAlgebraic('e4d5', b)).toBe('exd5')

  b.movePiece('g8', 'f6')
  expect(uciToAlgebraic('f6d7', b)).toBe('Nfd7')

  b.movePiece('e4', 'd5')
  expect(uciToAlgebraic('d8d5', b)).toBe('Qxd5')

  const rankDisambig = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. Nf3 e6 2. Nc3 Nh6 3. Ne5 Ng8 4. Nd5 Nh6 5. Ne3 *
  `)
  expect(uciToAlgebraic('e3c4', rankDisambig)).toBe('N3c4')

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
  expect(() => uciToAlgebraic('d7c8', promotion)).toThrow()
  expect(uciToAlgebraic('d7c8N', promotion)).toBe('dxc8=N')

  const check = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 *
  `)
  expect(uciToAlgebraic('d1h5', check)).toBe('Qh5+')

  const mate = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f6 2. d3 g5 *
  `)
  expect(uciToAlgebraic('d1h5', mate)).toBe('Qh5#')

  const promoCheck = new Board(`
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "*"]
    
    1. e4 f5 2. exf5 e6 3. fxe6 Qh4 4. e7 Nh6 
  `)
  expect(uciToAlgebraic('e7f8q', promoCheck)).toBe('exf8=Q+')
})
