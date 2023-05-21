type PuzzleSet = {
  [index: string]: {
    bestMove: string,
    moves: {
      [index: string]: {
        score: number,
        line: string[]
      }
    }
  }
}

export default PuzzleSet
