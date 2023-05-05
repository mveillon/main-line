import { Board } from "../../chessLogic/Board";
import Color from "../../chessLogic/Color";
import { doubleMove, parseMove } from "../../chessLogic/parser";
import Bishop from "../../chessLogic/pieces/Bishop";
import King from "../../chessLogic/pieces/King";
import Knight from "../../chessLogic/pieces/Knight";
import Pawn from "../../chessLogic/pieces/Pawn";
import { Piece } from "../../chessLogic/pieces/Piece";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";

const setUpBoard = (startingMoves: string[]): Board => {
    const res = new Board()
    for (const move of startingMoves) {
        doubleMove(move, res)
    }
    return res
}

test('scholars mate', () => {
    const b = new Board()

    parseMove('1. e4', b)
    expect(b.pieceAt('e2')).toBeNull()
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('e4') as Pawn).hasMoved).toBeTruthy()
    expect((b.pieceAt('e4') as Piece).color).toBe(Color.White)
    expect((b.pieceAt('e4') as Piece).coords).toBe('e4')

    parseMove('1. ...e5', b)
    expect(b.pieceAt('e7')).toBeNull()
    expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('e5') as Piece).color).toBe(Color.Black)
    expect((b.pieceAt('e5') as Piece).coords).toBe('e5')

    parseMove('2. Qh5', b)
    expect(b.pieceAt('d1')).toBeNull()
    expect(b.pieceAt('h5')).toBeInstanceOf(Queen)
    expect((b.pieceAt('h5') as Piece).color).toBe(Color.White)

    parseMove('2. ...Nc6', b)
    expect(b.pieceAt('b8')).toBeNull()
    expect(b.pieceAt('c6')).toBeInstanceOf(Knight)
    expect((b.pieceAt('c6') as Piece).color).toBe(Color.Black)

    parseMove('3. Bc4', b)
    expect(b.pieceAt('f1')).toBeNull()
    expect(b.pieceAt('c4')).toBeInstanceOf(Bishop)

    parseMove('3. ...Rb8??', b)
    expect(b.pieceAt('a8')).toBeNull()
    expect(b.pieceAt('b8')).toBeInstanceOf(Rook)

    parseMove('4. Qxf7#', b)
    expect(b.pieceAt('h5')).toBeNull()
    expect(b.pieceAt('f7')).toBeInstanceOf(Queen)
    expect((b.pieceAt('f7') as Piece).coords).toBe('f7')
    expect((b.pieceAt('f7') as Piece).color).toBe(Color.White)
})

test('double move', () => {
    const b = new Board()

    doubleMove('1. e4 e5', b)
    expect(b.pieceAt('e2')).toBeNull()
    expect(b.pieceAt('e4')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('e4') as Pawn).hasMoved).toBeTruthy()
    expect((b.pieceAt('e4') as Piece).color).toBe(Color.White)
    expect((b.pieceAt('e4') as Piece).coords).toBe('e4')

    expect(b.pieceAt('e7')).toBeNull()
    expect(b.pieceAt('e5')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('e5') as Piece).color).toBe(Color.Black)
    expect((b.pieceAt('e5') as Piece).coords).toBe('e5')

    doubleMove('2. Qh5 Nc6', b)
    expect(b.pieceAt('d1')).toBeNull()
    expect(b.pieceAt('h5')).toBeInstanceOf(Queen)
    expect((b.pieceAt('h5') as Piece).color).toBe(Color.White)

    expect(b.pieceAt('b8')).toBeNull()
    expect(b.pieceAt('c6')).toBeInstanceOf(Knight)
    expect((b.pieceAt('c6') as Piece).color).toBe(Color.Black)

    doubleMove('3. Bc4 Rb8??', b)
    expect(b.pieceAt('f1')).toBeNull()
    expect(b.pieceAt('c4')).toBeInstanceOf(Bishop)

    expect(b.pieceAt('a8')).toBeNull()
    expect(b.pieceAt('b8')).toBeInstanceOf(Rook)

    doubleMove('4. Qxf7#', b)
    expect(b.pieceAt('h5')).toBeNull()
    expect(b.pieceAt('f7')).toBeInstanceOf(Queen)
    expect((b.pieceAt('f7') as Piece).coords).toBe('f7')
    expect((b.pieceAt('f7') as Piece).color).toBe(Color.White)
})

test('captures', () => {
    const b = setUpBoard([
        '1. e4 d5',
        '2. exd5'
    ])

    expect(b.pieceAt('e4')).toBeNull()
    expect(b.pieceAt('d5')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('d5') as Piece).color).toBe(Color.White)

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
    expect((b.pieceAt('d6') as Piece).color).toBe(Color.White)

    parseMove('3. ...c4', b)
    doubleMove('4. d4 cxd3', b)
    expect(b.pieceAt('c4')).toBeNull()
    expect(b.pieceAt('d4')).toBeNull()
    expect(b.pieceAt('d3')).toBeInstanceOf(Pawn)
    expect((b.pieceAt('d3') as Piece).color).toBe(Color.Black)
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
    expect((q as Piece).color).toBe(Color.White)
    expect((q as Piece).coords).toBe('h8')

    const b2 = setUpBoard([
        '1. g4 d5',
        '2. e4 dxe4',
        '3. d4 e3', 
        '4. f3 e2',
        '5. Nh3 exd1=Q+'
    ])

    const q2 = b2.pieceAt('d1')
    expect(q2).toBeInstanceOf(Queen)
    expect((q2 as Piece).color).toBe(Color.Black)
    expect((q2 as Piece).coords).toBe('d1')
})
