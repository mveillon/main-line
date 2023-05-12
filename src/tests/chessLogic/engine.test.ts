import Game from "../../chessLogic/Game";
import { Engine } from "../../chessLogic/Engine";
import { uciToMove } from "../../chessLogic/parser";
import Color from "../../chessLogic/Color";
import { Piece } from "../../chessLogic/pieces/Piece";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";
import Knight from "../../chessLogic/pieces/Knight";
import Bishop from "../../chessLogic/pieces/Bishop";

// jest.setTimeout(2_147_483_647)
jest.setTimeout(20000)

const checkMove = (move: string, mover: Color, game: Game) => {
  const [from, to, promoType] = uciToMove(move)
  const fromPiece = game.board.pieceAt(from)
  expect(fromPiece).toBeInstanceOf(Piece)
  expect(fromPiece?.color).toBe(mover)

  const toPiece = game.board.pieceAt(to)
  expect(toPiece === null || toPiece.color !== mover).toBeTruthy()

  if (typeof promoType !== 'undefined') {
    expect([Queen, Rook, Knight, Bishop]).toContain(promoType)
  }
}

test('engine', async () => {
  const g = new Game()
  const e = new Engine(5, 5)
  g.playMove('e2', 'e4')

  let moves = await e.getBestMoves(g.toFEN())
  expect(moves.length).toBe(5)

  for (const m of moves) {
    checkMove(m.move, Color.Black, g)
  }

  g.playMove('d7', 'd5')
  moves = await e.getBestMoves(g.toFEN())
  expect(moves.length).toBe(5)

  for (const m of moves) {
    checkMove(m.move, Color.White, g)
  }

  e.quit()
})
