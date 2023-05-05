import "./styling/BoardComponent.css"
import { useState } from "react";

import PieceComponent from "./PieceComponent";
import { Board } from "../chessLogic/Board";
import { arange, full, getShape } from "../utils/numJS";
import { Piece } from "../chessLogic/pieces/Piece";
import { indicesToNotation } from "../chessLogic/notationIndices";
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

  const getOnClick = (i: number, j: number): (() => void) => {
    return () => {
      const realI = getInd(i)
      const realJ = getInd(j)

      const p = board.board[realI][realJ]
      const isOwnPiece = p !== null && p.color === props.game.turn
      if (pieceSelected === null || isOwnPiece) {
        if (isOwnPiece) {
          setPieceSelected(p)
          isSelected[realI][realJ] = true
          setIsSelected(isSelected)
        }
      } else if (p === null || p.color !== props.game.turn) {
        isSelected[realI][realJ] = false
        setIsSelected(isSelected)
        props.playMove(pieceSelected.coords, indicesToNotation(realI, realJ))
        setPieceSelected(null)
      }
    }
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
                  const selected = isSelected[getInd(i)][getInd(j)]
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

      <button onClick={() => setReversed(!reversed)}>
        Reverse board
      </button>
    </div>
  )
}

export default BoardComponent

