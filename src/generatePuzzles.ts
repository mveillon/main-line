import { Engine } from "./chessLogic/Engine"
import Game from "./chessLogic/Game"
import { randInt, choice } from "./utils/random"
import { toFEN } from "./chessLogic/fenPGN"
import { arange } from "./utils/numJS"
import { uciToMove } from "./chessLogic/parser"
import { writeFile } from "fs"

/**
 * Generates `numPuzzles` opening puzzles from the `startPGN` and writes the FENs
 * of each to `outFile`
 * @param startPGN the position to start generating from
 * @param numPuzzles at most how many puzzles to generate. Less rich openings may
 * not generate this many
 * @param outFile where to save the output to
 * @param depth the depth to run Stockfish at
 * @param movesDeep how many moves deep to make the puzzles. Default is 10
 */
const generatePuzzles = async (
  startPGN: string, 
  numPuzzles: number, 
  outFile: string, 
  depth: number,
  movesDeep: number = 10
) => {
  const puzzles = new Set<string>()

  const sf = new Engine(depth, 5)
  for (let i = 0; i < numPuzzles; i++) {
    const g = new Game(startPGN)
    const depth = randInt(1, movesDeep)
    for (let j = 0; j < depth; j++) {
      const bestMoves = await sf.getBestMoves(toFEN(g))
      let filtered = bestMoves.filter(m => m.score > 0)
      if (filtered.length === 0) {
        filtered = bestMoves
      }

      const scores = filtered.map(m => m.score)
      const smallest = Math.min(...scores)
      const adj = smallest < 0 ? smallest : 0
      scores[0] -= adj
      for (let k = 1; k < scores.length; k++) {
        scores[k] += scores[k - 1] - adj
      }

      const toPlay = choice(arange(scores.length), scores)
      const move = filtered[toPlay]
      g.playMove(...uciToMove(move.move))
    }
    puzzles.add(toFEN(g))
    console.log(`Puzzle No. ${puzzles.size} found!`)
  }

  sf.quit()

  const toWrite = {
    puzzles: [...puzzles]
  }

  writeFile(
    outFile, 
    JSON.stringify(toWrite), 
    err => { }
  )
}

console.log('Starting...')
generatePuzzles(
  '1. d4 d5 2. Bf4',
  50,
  'src/puzzles/London.json',
  30
)
