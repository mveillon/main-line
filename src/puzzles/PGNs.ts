export interface PuzzleInfo {
  openingName: string, // the name of the opening
  depth: number, // what depth to run Stockfish at
  numPuzzles: number, // how many puzzles to generate
  pgn: string // what is the starting PGN for all puzzles to generate from
}

export const PGNs: { [index: string]: PuzzleInfo } = {
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
  }
}


