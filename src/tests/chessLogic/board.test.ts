import { Board } from "../../chessLogic/Board";
import Color from "../../chessLogic/Color";
import Bishop from "../../chessLogic/pieces/Bishop";
import King from "../../chessLogic/pieces/King";
import Knight from "../../chessLogic/pieces/Knight";
import Pawn from "../../chessLogic/pieces/Pawn";
import Piece from "../../chessLogic/pieces/Piece";
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
