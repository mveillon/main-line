/**
 * An interface for all config settings when generating puzzles
 * @param openingName the name of the opening
 * @param depth what depth to run Stockfish at
 * @param numPuzzles how many puzzles to generate
 * @param pgn the starting PGN for all puzzles to generate from
 */
export interface PuzzleInfo {
  openingName: string
  depth: number
  numPuzzles: number
  pgn: string
}

/**
 * Gives the PGNs and names of all opening puzzles
 * @returns the config settings for all openings to generate puzzles for
 */
export const PGNs = (): { [index: string]: PuzzleInfo } => {
  return {
    'Caro-Kann': {
      openingName: 'Caro-Kann', 
      depth: 20,
      numPuzzles: 20,
      pgn: '1. e4 c6 2. d4 d5'
    },

    'London': {
      openingName: 'London',
      depth: 20,
      numPuzzles: 20,
      pgn: '1. d4 d5 2. Bf4'
    },

    // 'Italian': {
    //   openingName: 'Italian',
    //   depth: 20,
    //   numPuzzles: 20,
    //   pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4'
    // }
  }
}
