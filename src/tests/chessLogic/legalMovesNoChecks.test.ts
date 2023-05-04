import { Board } from "../../chessLogic/Board";
import Piece from "../../chessLogic/pieces/Piece";
import { compareSetToArray } from "./testUtilts";

test('legalMovesNoChecks', () => {
    const b = new Board()

    const numMoves = (coord: string): number | undefined => {
        return b.pieceAt(coord)?.legalMovesNoChecks().size
    }

    const cantMove = [
        'a1', 'c1', 'd1', 'e1', 'f1', 'h1',
        'a8', 'c8', 'd8', 'e8', 'f8', 'h8'
    ]

    for (const coord of cantMove) {
        expect(numMoves(coord)).toBe(0)
    }

    let knightMoves = (b.pieceAt('b1') as Piece).legalMovesNoChecks()
    compareSetToArray(knightMoves, ['a3', 'c3'])
    knightMoves = (b.pieceAt('g1') as Piece).legalMovesNoChecks()
    compareSetToArray(knightMoves, ['f3', 'h3'])
    knightMoves = (b.pieceAt('b8') as Piece).legalMovesNoChecks()
    compareSetToArray(knightMoves, ['a6', 'c6'])
    knightMoves = (b.pieceAt('g8') as Piece).legalMovesNoChecks()
    compareSetToArray(knightMoves, ['f6', 'h6'])
    
    const files = 'abcdefgh'
    for (const file of files) {
        let pawnMoves = (b.pieceAt(file + '2') as Piece).legalMovesNoChecks()
        compareSetToArray(pawnMoves, [file + '3', file + '4'])

        pawnMoves = (b.pieceAt(file + 7) as Piece).legalMovesNoChecks()
        compareSetToArray(pawnMoves, [file + '6', file + '5'])
    }

    b.movePiece('e2', 'e4')
    let pawnMoves = (b.pieceAt('e4') as Piece).legalMovesNoChecks()
    compareSetToArray(pawnMoves, ['e5'])

    let bishopMoves = (b.pieceAt('f1') as Piece).legalMovesNoChecks()
    compareSetToArray(bishopMoves, ['e2', 'd3', 'c4', 'b5', 'a6'])

    b.movePiece('e4', 'e2')
    b.movePiece('d2', 'd4')

    let queenMoves = (b.pieceAt('d1') as Piece).legalMovesNoChecks()
    compareSetToArray(queenMoves, ['d2', 'd3'])

    b.movePiece('a7', 'a5')
    b.movePiece('e2', 'e4')
    queenMoves = (b.pieceAt('d1') as Piece).legalMovesNoChecks()
    compareSetToArray(queenMoves, ['d2', 'd3', 'e2', 'f3', 'g4', 'h5'])

    let rookMoves = (b.pieceAt('a8') as Piece).legalMovesNoChecks()
    compareSetToArray(rookMoves, ['a7', 'a6'])

    let kingMoves = (b.pieceAt('e1') as Piece).legalMovesNoChecks()
    compareSetToArray(kingMoves, ['d2', 'e2'])

    const b2 = new Board()
    b2.movePiece('d1', 'd4')
    queenMoves = (b2.pieceAt('d4') as Piece).legalMovesNoChecks()
    compareSetToArray(
        queenMoves,
        [
            'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4',
            'd3', 'd5', 'd6', 'd7', 'e5',
            'c3', 'e3', 'c5', 'b6', 'a7', 'f6', 'g7'
        ]
    )

    b2.movePiece('d7', 'd5')
    pawnMoves = (b2.pieceAt('d5') as Piece).legalMovesNoChecks()
    compareSetToArray(pawnMoves, [])

    b2.movePiece('e7', 'e5')
    pawnMoves = (b2.pieceAt('e5') as Piece).legalMovesNoChecks()
    compareSetToArray(pawnMoves, ['d4', 'e4'])
}) 
