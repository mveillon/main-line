import { Engine } from "./chessLogic/Engine"
import Game from "./chessLogic/Game"
import { randInt, choice } from "./utils/random"
import { toFEN, fromFEN } from "./chessLogic/fenPGN"
import { arange, scalarMul } from "./utils/numJS"
import { uciToMove } from "./chessLogic/parser"
import { writeFileSync, readFile, copyFileSync } from "fs"
import { Piece } from "./chessLogic/pieces/Piece"
import Color from "./chessLogic/Color"
import Queen from "./chessLogic/pieces/Queen"

type moveMap = { [index: string]: { score: number, line: string[] }}

interface puzzleInfo {
  moves: moveMap
  bestMove: string
}

/**
 * Generates `numPuzzles` opening puzzles from the `startPGN` and writes the FENs
 * of each to `outFile`
 * @param startPGN the position to start generating from
 * @param numPuzzles at most how many puzzles to generate. Less rich openings may
 * not generate this many
 * @param outFile where to save the output to
 * @param depth the depth to run Stockfish at
 * @param player which player is solving the puzzles
 * @param movesDeep how many moves deep to make the puzzles. Default is 10
 */
const generatePuzzles = async (
  startPGN: string, 
  numPuzzles: number, 
  outFile: string, 
  depth: number,
  player: Color,
  movesDeep: number = 10
) => {
  const puzzles: { [index: string]: {} } = {}

  const sf = new Engine(depth, 5)
  try {
    for (let i = 0; i < numPuzzles; i++) {
      const g = new Game(startPGN)
  
      const playRandomMove = async () => {
        const bestMoves = await sf.getBestMoves(toFEN(g))
  
        let scores = bestMoves.map(m => m.score)
        if (player === Color.Black) {
          scores = scalarMul(scores, -1) as number[]
        }
        const smallest = Math.min(...scores)
        const adj = smallest < 0 ? smallest : 0
        scores[0] -= adj
        for (let k = 1; k < scores.length; k++) {
          scores[k] += scores[k - 1] - adj
        }
  
        const toPlay = choice(arange(scores.length), scores)
        const move = bestMoves[toPlay]
        g.playMove(...uciToMove(move.move))
      }
      
      const depth = randInt(1, movesDeep)
      for (let j = 0; j < depth; j++) {
        await playRandomMove()
      }
  
      if (g.turn !== player) {
        await playRandomMove()
      }
      puzzles[toFEN(g)] = {}
      console.log(`Puzzle No. ${Object.keys(puzzles).length} found!`)
    }
  
    sf.quit()
  } finally {
    writeFileSync(
      outFile, 
      JSON.stringify(puzzles), 
    )
  }  
}

/**
 * For each puzzle, looks at every possible move the player can make, gives it a 
 * score, and finds the best continuation for that move
 * @param path where the puzzles are
 * @param depth the depth to run the engine at
 */
const analyzeLines = async (path: string, depth: number) => {
  const sf = new Engine(depth, 1)

  return new Promise<void>((resolve, reject) => {
    readFile(path, 'utf-8', async (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const puzzles = JSON.parse(data)
      const res: { [index: string]: puzzleInfo } = {}
      
      try {
        for (const puzzle in puzzles) {
          const g = new Game(undefined, puzzle)
    
          const betterScore = (s1: number, s2: number): boolean => {
            if (g.turn === Color.White) {
              return s1 > s2
            }
            return s2 < s1
          }
    
          const allPieces = g.board.findPieces(Piece, g.turn)
          const mapping: moveMap = {}
          let bestMove: string = ''
    
          for (const piece of allPieces) {
            for (const move of piece.legalMoves()) {
              const uci = piece.coords + move
              g.playMove(piece.coords, move, Queen)
              const continuation = (await sf.getBestMoves(toFEN(g)))[0]
              mapping[uci] = {
                score: continuation.score,
                line: [continuation.move, ...continuation.line.slice(0, 5)]
              }
              fromFEN(puzzle, g)
    
              if (
                bestMove === '' || 
                betterScore(continuation.score, mapping[bestMove].score)
              ) {
                bestMove = uci
              }
            }
          }
    
          res[puzzle] = {
            moves: mapping,
            bestMove: bestMove
          }
          console.log(`Puzzle No. ${Object.keys(res).length} analyzed`)
        }
    
        sf.quit()
      } finally {
        writeFileSync(
          path,
          JSON.stringify(res)
        )
      }
      
      resolve(undefined)
    })
  })
}

/**
 * Runs an async function and prints how long it takes to complete.
 * For reference, depth=30 takes about 30 hours to generate and analyze
 * 50 puzzles
 * @param func the function to run
 */
const timeAsync = async (func: () => Promise<void>) => {
  const startTime = Date.now()
  await func()

  const timeTaken = Date.now() - startTime
  const hours = (timeTaken / 3.6e6).toLocaleString(
    'en-us', 
    {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    }
  )
  console.log(`Completed after ${hours} hours\n`)
}

const OPENING_NAME = 'London-Black'
const DEPTH = 25

console.log(`Generating puzzles for the ${OPENING_NAME}...`)

timeAsync(() => (
  generatePuzzles(
    '1. d4 d5 2. Bf4',
    50,
    `src/puzzles/${OPENING_NAME}.json`,
    DEPTH,
    Color.Black
  )
)).then(() => {
  copyFileSync(
    `src/puzzles/${OPENING_NAME}.json`,
    `src/puzzles/notAnalyzed/${OPENING_NAME}.json`
  )

  timeAsync(() => (
    analyzeLines(`src/puzzles/${OPENING_NAME}.json`, DEPTH)
  ))
})
