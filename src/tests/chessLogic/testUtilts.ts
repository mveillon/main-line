import { Board } from "../../chessLogic/Board"
import { doubleMove } from "../../chessLogic/parser"

export const compareSetToArray = <T>(s: Set<T>, arr: T[]): boolean => {
  expect(s.size).toBe(arr.length)
  for (const el of arr) {
    expect(s.has(el)).toBeTruthy()
  }
  return true
}

export const setUpBoard = (startingMoves: string[]): Board => {
  const res = new Board()
  for (const move of startingMoves) {
    doubleMove(move, res)
  }
  return res
}