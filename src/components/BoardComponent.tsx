import "./styling/BoardComponent.css"
import { useState } from "react";

import PieceComponent from "./PieceComponent";
import { arange, full, getShape } from "../utils/numJS";
import { Piece } from "../chessLogic/pieces/Piece";
import { indicesToNotation, notationToIndices } from "../chessLogic/notationIndices";
import Game from "../chessLogic/Game";

const BoardComponent = (
  props: {
    game: Game, 
    playMove: (from: string, to: string) => void
  }) => {
  
  const board = props.game.board
  const [reversed, setReversed] = useState(true)
  const [pieceSelected, setPieceSelected] = useState<Piece | null>(null)

  const [isSelected, setIsSelected] = useState(
    full(getShape(board.board), false) as boolean[][]
  )

  const getInd = (i: number): number => {
    if (reversed) {
      return board.board.length - 1 - i
    } else {
      return i
    }
  }

  const unselectPiece = () => {
    if (pieceSelected === null) return
    const [origI, origJ] = notationToIndices(pieceSelected.coords)
    isSelected[getInd(origI)][getInd(origJ)] = false
    setIsSelected(isSelected)

    setPieceSelected(null)
  }

  const getOnClick = (i: number, j: number): (() => void) => {
    return () => {
      const realI = getInd(i)
      const realJ = getInd(j)

      const p = board.board[realI][realJ]
      const isOwnPiece = p !== null && p.color === props.game.turn
      if (pieceSelected === null || isOwnPiece) {
        if (isOwnPiece) {
          setPieceSelected(p)
          isSelected[i][j] = true
          setIsSelected(isSelected)
        }
      } else if (p === null || p.color !== props.game.turn) {
        const toMove = pieceSelected
        unselectPiece()

        props.playMove(pieceSelected.coords, indicesToNotation(realI, realJ))
      }
    }
  }

  const reverseBoard = () => {
    if (pieceSelected !== null) {
      unselectPiece()
    }
    setReversed(!reversed)
  }

  const inds = arange(board.board.length)

  return (
    <div>
      <table>
        <tbody>
          {inds.map((i) => {
            return (
              <tr key={i}>
                {inds.map((j) => {
                  const square = board.board[getInd(i)][getInd(j)]
                  const selected = isSelected[i][j]
                  return (
                    <td
                      key={j} 
                      className={(i + j) % 2 === 0 ? "white-square" : "black-square"}
                      onClick={getOnClick(i, j)}
                    >
                      {
                        square !== null &&
                        <PieceComponent piece={square} selected={selected} />
                      }
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <button onClick={reverseBoard}>
        Reverse board
      </button>
    </div>
  )
}

export default BoardComponent

