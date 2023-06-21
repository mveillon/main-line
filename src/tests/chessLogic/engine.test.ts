import Game from "../../chessLogic/Game";
import { Engine } from "../../chessLogic/Engine";
import { uciToMove } from "../../chessLogic/parser";
import COLOR from "../../chessLogic/Color";
import { Piece } from "../../chessLogic/pieces/Piece";
import Queen from "../../chessLogic/pieces/Queen";
import Rook from "../../chessLogic/pieces/Rook";
import Knight from "../../chessLogic/pieces/Knight";
import Bishop from "../../chessLogic/pieces/Bishop";
import { toFEN } from "../../chessLogic/fenPGN";
import ENGINE_STATUS from "../../chessLogic/EngineStatus";

jest.setTimeout(2_147_483_647)

const checkMove = (move: string, mover: COLOR, game: Game) => {
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
      checkMove(m.move, COLOR.BLACK, g)
    }
  
    g.playMove('d7', 'd5')
    moves = await e.getBestMoves(toFEN(g))
    expect(moves.length).toBe(5)
  
    for (const m of moves) {
      checkMove(m.move, COLOR.WHITE, g)
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
    expect(moves[i - 1].score).toBeGreaterThanOrEqual(moves[i].score)
  }

  g.playMove('e2', 'e4')
  moves = await e.getBestMoves(toFEN(g))
  for (let i = 1; i < moves.length; i++) {
    expect(moves[i - 1].score).toBeGreaterThanOrEqual(moves[i].score)
  }

  e.quit()
})

test('engine stopping', async () => {
  const numMoves = 5
  const e = new Engine(15, numMoves)
  const g = new Game()
  const moves = await e.getBestMoves(toFEN(g))

  expect(moves.length).toBe(numMoves)

  // eslint-disable-next-line jest/valid-expect-in-promise
  e.getBestMoves(toFEN(g)).then((moves) => {
    expect(moves.length).toBeLessThan(numMoves)
  })
  await e.stop()

  g.playMove('e2', 'e4')
  expect(g.turn).toBe(COLOR.BLACK)
  const newMoves = await e.getBestMoves(toFEN(g))
  expect(newMoves.length).toBe(numMoves)

  for (const move of newMoves) {
    checkMove(move.move, COLOR.BLACK, g)
  }

  await e.stop()
  expect((await e.getBestMoves(toFEN(g))).length).toBe(numMoves)
  e.quit()
})

test('status', async () => {
  const g = new Game()
  const e = new Engine(15, 5)
  expect(e.status).toBe(ENGINE_STATUS.IDLE)

  await new Promise<void>((resolve, _reject) => {
    e.getBestMoves(toFEN(g)).then((moves) => {
      expect(e.status).toBe(ENGINE_STATUS.IDLE)
      expect(moves.length).toBe(5)
      resolve(undefined)
    })
    expect(e.status).toBe(ENGINE_STATUS.CALCULATING)
  })
  
  await new Promise<void>((resolve, _reject) => {
    e.getBestMoves(toFEN(g)).then((moves) => {
      expect(e.status).toBe(ENGINE_STATUS.IDLE)
      expect(moves.length).toBeLessThan(5)
    })
    e.stop().then(() => {
      resolve(undefined)
      e.quit()
    })
    expect(e.status).toBe(ENGINE_STATUS.STOPPING)
  })
})

test('mate', async () => {
  const engine = new Engine(10, 1)
  const m1 = 'rnbqkbnr/ppppp2p/5p2/6p1/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq g6 0 3'
  let moves = await engine.getBestMoves(m1)
  expect(moves.length).toBe(1)
  expect(moves[0].mate).toBe(1)
  expect(moves[0].move).toBe('d1h5')

  const m2 = 'r1bq2r1/b4pk1/p1pp1p2/1p2pP2/1P2P1PB/3P4/1PPQ2P1/R3K2R w - - 0 0'
  moves = await engine.getBestMoves(m2)
  expect(moves.length).toBe(1)
  expect(moves[0].mate).toBe(2)
  expect(moves[0].move).toBe('d2h6')
  expect(moves[0].line).toEqual([
    'g7h6',
    'h4f6'
  ])

  engine.quit()
})
