/**
 * Within a BoardT, each letter corresponds to one column. For example,
 * the 1st column is the g file, meaning square g3 corresponds to a square
 * in the 1st column of the BoardT. This converts the letter to the 
 * corresponding column
 * @param letter the file of the chess board. Should be between a and h
 * @returns which column within the BoardT it corresponds to
 */
export const letterToCol = (letter: string): number => {
  const code = letter.charCodeAt(0)
  // 104 is h and 97 is a in ASCII
  if (code > 104 || code < 97) {
    throw new Error(`Unexpected letter ${letter}. Should be between a and h`)
  }
  return 104 - code
}

/**
 * Within a BoardT, each letter corresponds to one column. For example,
 * the 1st column is the g file, meaning square g3 corresponds to a square
 * in the 1st column of the BoardT. This converts the index to the
 * corresponding letter
 * @param ind the index within the BoardT
 * @returns the letter of the corresponding index. Will be between a and h
 */
export const indexToLetter = (ind: number): string => {
  if (ind < 0 || ind > 7) {
    throw new Error(`Index out of bounds ${ind}`)
  }
  return String.fromCharCode(104 - ind)
}

/**
 * Converts the chess notation board square to indices to use in a BoardT
 * @param coords the chess notation coordinates e.g. h5
 * @returns an `[i, j]` pair of coordinates
 */
export const notationToIndices = (coords: string): [number, number] => {
  if (coords.length !== 2) {
    throw new Error(`Invalid coordinates ${coords}`)
  }

  return [
    parseInt(coords[1]) - 1, 
    letterToCol(coords[0])
  ]
}

/**
 * Converts the indices into a BoardT into chess notation
 * @param rank the rank of the square; the row of the BoardT
 * @param file the file of the square; the column of the BoardT
 * @returns the indices as chess notation
 */
export const indicesToNotation = (rank: number, file: number): string => {
  if (rank < 0 || rank > 7) {
    throw new Error(`Invalid indices [${rank}, ${file}]`)
  }

  return `${indexToLetter(file)}${rank + 1}`
}