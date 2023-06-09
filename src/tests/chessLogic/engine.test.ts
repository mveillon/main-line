import Game from "../../chessLogic/Game";
import { Engine } from "../../chessLogic/Engine";
import { uciToMove } from "../../chessLogic/parser";
import Color from "../../chessLogic/Color";
import { Piece } from "../../chessLogic/pieces/Piece";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";
import Knight from "../../chessLogic/pieces/Knight";
import Bishop from "../../chessLogic/pieces/Bishop";
import { toFEN } from "../../chessLogic/fenPGN";
import { appendFile, writeFileSync } from "fs";

jest.setTimeout(2_147_483_647)

beforeEach(() => {
  // we do this because Stockfish makes some `fetch` calls, but only if `fetch`
  // is a function. Should NOT be done anywhere else. You should use a mock function
  // instead. 
  
  // @ts-ignore
  global.fetch = undefined
})

const checkMove = (move: string, mover: Color, game: Game) => {
  const [from, to, promoType] = uciToMove(move)
  const fromPiece = game.board.pieceAt(from)
  expect(fromPiece).toBeInstanceOf(Piece)
  expect(fromPiece?.color).toBe(mover)
  expect(fromPiece?.legalMoves()).toContain(to)

  const toPiece = game.board.pieceAt(to)
  expect(toPiece === null || toPiece.color !== mover).toBeTruthy()

  if (typeof promoType !== 'undefined') {
    expect([Queen, Rook, Knight, Bishop]).toContain(promoType)
  }
}

test('engine', async () => {
  const g = new Game()
  const e = new Engine(5, 5)

  try {
    g.playMove('e2', 'e4')

    let moves = await e.getBestMoves(toFEN(g))
    expect(moves.length).toBe(5)
  
    for (const m of moves) {
      checkMove(m.move, Color.Black, g)
    }
  
    g.playMove('d7', 'd5')
    moves = await e.getBestMoves(toFEN(g))
    expect(moves.length).toBe(5)
  
    for (const m of moves) {
      checkMove(m.move, Color.White, g)
    }
  } finally {
    e.quit()
  }
})

test('sorted by score', async () => {
  const g = new Game()
  const e = new Engine(5, 5)

  let moves = await e.getBestMoves(toFEN(g))
  for (let i = 1; i < moves.length; i++) {
    expect(moves[i - 1].score <= moves[i].score)
  }

  g.playMove('e2', 'e4')
  moves = await e.getBestMoves(toFEN(g))
  for (let i = 1; i < moves.length; i++) {
    expect(moves[i - 1].score >= moves[i].score)
  }

  e.quit()
})

test('engine stopping', async () => {
  const numMoves = 5
  const e = new Engine(15, numMoves)
  const g = new Game()
  const moves = await e.getBestMoves(toFEN(g))

  expect(moves.length).toBe(numMoves)

  e.getBestMoves(toFEN(g)).then((moves) => {
    expect(moves.length).toBeLessThan(numMoves)
  })
  await e.stop()

  g.playMove('e2', 'e4')
  expect(g.turn).toBe(Color.Black)
  const newMoves = await e.getBestMoves(toFEN(g))
  expect(newMoves.length).toBe(numMoves)

  for (const move of newMoves) {
    checkMove(move.move, Color.Black, g)
  }

  e.quit()
})
