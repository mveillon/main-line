import { 
  letterToCol, 
  indexToLetter, 
  notationToIndices, 
  indicesToNotation 
} from "../../chessLogic/notationIndices";
import { randInt, choice } from "../../utils/random"

test('letterToCol', () => {
  const cols = 'hgfedcba'

  for (let i = 0; i < cols.length; i++) {
    expect(letterToCol(cols[i])).toBe(i)
    expect(indexToLetter(i)).toBe(cols[i])
  }
})

test('notationToIndices', () => {
  expect(notationToIndices('h1')).toEqual([0, 0])
  expect(notationToIndices('a1')).toEqual([0, 7])
  expect(notationToIndices('h8')).toEqual([7, 0])
  expect(notationToIndices('a8')).toEqual([7, 7])
  expect(notationToIndices('e4')).toEqual([3, 3])
  expect(notationToIndices('d5')).toEqual([4, 4])
})

test('indicesToNotation', () => {
  expect(indicesToNotation(0, 0)).toBe('h1')
  expect(indicesToNotation(0, 7)).toBe('a1')
  expect(indicesToNotation(7, 0)).toBe('h8')
  expect(indicesToNotation(7, 7)).toBe('a8')
  expect(indicesToNotation(3, 3)).toBe('e4')
  expect(indicesToNotation(4, 4)).toBe('d5')
})

test('randomIndices', () => {
  const iters = 32
  const files = 'abcdefgh'.split('')
  for (let i = 0; i < iters; i++) {
    const square = choice(files) + randInt(1, 9).toString()
    expect(indicesToNotation(...notationToIndices(square))).toBe(square)
  }
})
