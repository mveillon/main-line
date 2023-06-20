/**
 * An interface for all config settings when generating puzzles
 * @param openingName the name of the opening
 * @param variantName the name of the variant of the opening
 * @param depth what depth to run Stockfish at
 * @param numPuzzles how many puzzles to generate
 * @param pgn the starting PGN for all puzzles to generate from
 */
export interface PuzzleInfo {
  openingName: string
  variantName: string
  depth: number
  numPuzzles: number
  pgn: string
}

/**
 * Gives the PGNs and names of all opening puzzles
 * @returns the config settings for all openings to generate puzzles for
 */
export const PGNs = (): PuzzleInfo[] => {
  const depth = 20
  const numPuzzles = 20
  return [
    {
      openingName: 'Caro-Kann',
      variantName: 'Advance', 
      depth: depth,
      numPuzzles: numPuzzles,
      pgn: '1. e4 c6 2. d4 d5 3. e5'
    },

    // {
    //   openingName: 'Caro-Kann',
    //   variantName: 'Exchange',
    //   depth: depth,
    //   numPuzzles: numPuzzles,
    //   pgn: '1. e4 c6 2. d4 d5 3. exd5 cxd5'
    // },

    // {
    //   openingName: 'Caro-Kann',
    //   variantName: 'Ignore',
    //   depth: depth,
    //   numPuzzles: numPuzzles,
    //   pgn: '1. e4 c6 2. d4 d5 3. Nc3'
    // },

    // {
    //   openingName: 'London',
    //   variantName: 'Standard',
    //   depth: depth,
    //   numPuzzles: numPuzzles,
    //   pgn: '1. d4 d5 2. Bf4'
    // },

    // {
    //   openingName: 'London',
    //   variantName: 'c4',
    //   depth: depth,
    //   numPuzzles: numPuzzles,
    //   pgn: '1.d4 d5 2. Bf4 Nc6 3. c4'
    // }
  ]
}
