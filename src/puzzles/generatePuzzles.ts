import { Engine } from "../chessLogic/Engine"
import Game from "../chessLogic/Game"
import { randInt, choice } from "../utils/random"
import { toFEN } from "../chessLogic/fenPGN"
import { arange } from "../utils/numJS"
import { uciToMove } from "../chessLogic/parser"
import { writeFileSync, readFile, existsSync, mkdirSync } from "fs"
import COLOR from "../chessLogic/Color"
import PuzzleSet from "./PuzzleSet"
import { PuzzleInfo, PGNs } from "./PGNs"

// TODO : add traps. We can define a trap using Lichess' game database. A trap is
// any move that is played reasonably often (say 5%) among intermediate players 
// (maybe 1500-2000 on Lichess) that blunders a decent amount of advantage (maybe 3+
// points)

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
  player: COLOR,
  movesDeep = 10
) => {
  const puzzles: { [index: string]: Record<string, never> } = {}

  const engine = new Engine(depth, 5)
  try {
    for (let i = 0; i < numPuzzles; i++) {
      const g = new Game(startPGN)

      const playRandomMove = async () => {
        const bestMoves = await engine.getBestMoves(toFEN(g))
        let move: string
        if (g.turn === player) {
          move = bestMoves[0].move
        } else {
          const scores = bestMoves.map(m => m.score)
          const smallest = Math.min(...scores)
          const adj = smallest < 0 ? smallest : 0
          scores[0] -= adj
          for (let k = 1; k < scores.length; k++) {
            scores[k] += scores[k - 1] - adj
          }
    
          const toPlay = choice(arange(scores.length), scores)
          move = bestMoves[toPlay].move
        }
        g.playMove(...uciToMove(move))
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
  } finally {
    engine.quit()
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
  const engine = new Engine(depth, 100) // just get all the moves

  return new Promise<void>((resolve, reject) => {
    readFile(path, 'utf-8', async (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const puzzles = JSON.parse(data)
      const res: PuzzleSet = {}
      
      try {
        for (const puzzle in puzzles) {
          const g = new Game(undefined, puzzle)
          const mapping: {
            [index: string]: {
              score: number,
              line: string[],
              mate?: number
            }
          } = {}
          const moves = await engine.getBestMoves(toFEN(g))
          for (const { move, score, line, mate } of moves) {
            mapping[move] = {
              score: score,
              line: line,
              mate: mate
            }
          }
          res[puzzle] = {
            moves: mapping,
            bestMove: moves[0].move
          }
          console.log(`Puzzle No. ${Object.keys(res).length} analyzed`)
        }
    
      } finally {
        engine.quit()
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
 * For reference, `depth` = 30 and `numPuzzles` = 50 takes about 30 hours while
 * `depth` = 20 and `numPuzzles` = 20 takes about 30 minutes
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

/**
 * Generates and analyzes puzzles given the info in settings, timing how long it takes
 * both to generate and analyze the puzzles.
 * @param settings all needed information about the puzzle. See `PGNs.ts:PuzzleInfo` 
 * for arg info
 */
const genPuzzles = async (settings: PuzzleInfo) => {
  for (const c of [COLOR.WHITE, COLOR.BLACK]) {
    const cStr = c === COLOR.WHITE ? 'white' : 'black'
    console.log(
      `Generating puzzles for the ${settings.variantName} ` +
      `${settings.openingName} for ${cStr}...`
    )

    const rootDir = `src/puzzles/${settings.openingName}/${settings.variantName}`
    const path = `${rootDir}/${cStr}.json`

    if (!existsSync(rootDir)) {
      mkdirSync(rootDir, { recursive: true })
    }

    await timeAsync(() => (
      generatePuzzles(
        settings.pgn, 
        settings.numPuzzles,
        path,
        settings.depth,
        c
      )
    ))

    await timeAsync(() => (
      analyzeLines(
        path,
        settings.depth
      )
    ))
  }
  
}

/**
 * Generates and analyzes all puzzles in `PGNs.ts`
 */
const allPuzzles = () => {
  timeAsync(async () => {
    const pgns = PGNs()
    for (const pgn of pgns) {
      await genPuzzles(pgn)
    }
  })
}

allPuzzles()
