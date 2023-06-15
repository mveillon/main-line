import React from "react";
import "./styling/BoardComponent.css"
import "./styling/global.css"
import { useState } from "react";

import PieceComponent from "./PieceComponent";
import { arange, full, getShape } from "../utils/numJS";
import { Piece, PieceT } from "../chessLogic/pieces/Piece";
import { indicesToNotation, notationToIndices } from "../chessLogic/notationIndices";
import Game from "../chessLogic/Game";
import COLOR from "../chessLogic/Color";
import PromotionSelector from "./PromotionSelector";
import Pawn from "../chessLogic/pieces/Pawn";

/**
 * A board to play chess on
 * @param game the game to render
 * @param playMove what to call when the player plays a move
 * @param perspective whose pieces should be on the bottom of the board
 * @param canMove whether the player is allowed to move at this moment
 */
const BoardComponent = (
  props: {
    game: Game, 
    playMove: (from: string, to: string, promoType?: PieceT) => void,
    perspective: COLOR,
    canMove: boolean
  }) => {
  
  const board = props.game.board
  const [reversed, setReversed] = useState(props.perspective === COLOR.WHITE)
  const [pieceSelected, setPieceSelected] = useState<Piece | null>(null)
  const [promoting, setPromoting] = useState<{ p: Piece, dest: string }>()
  const [legalMoves, setLegalMoves] = useState<Set<string>>()

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
    const [origI, origJ] = notationToIndices((pieceSelected as Piece).coords)
    isSelected[getInd(origI)][getInd(origJ)] = false
    setIsSelected(isSelected)

    setPieceSelected(null)
    setLegalMoves(undefined)
  }

  const getOnClick = (i: number, j: number): (() => void) => {
    return () => {
      const realI = getInd(i)
      const realJ = getInd(j)

      const p = board.board[realI][realJ]
      const isOwnPiece = (
        p !== null && 
        p.color === props.game.turn &&
        (
          pieceSelected === null ||
          pieceSelected.coords !== indicesToNotation(realI, realJ)
        )
      )
      if (props.canMove && (pieceSelected === null || isOwnPiece)) {
        if (isOwnPiece) {
          setPieceSelected(p)
          setLegalMoves(p.legalMoves())
          isSelected[i][j] = true
          setIsSelected(isSelected)
        }
      } else if (pieceSelected !== null && !isOwnPiece) {
        const toMove = pieceSelected
        unselectPiece()

        const dest = indicesToNotation(realI, realJ)
        if (toMove.legalMoves().has(dest)) {
          if (toMove instanceof Pawn && (dest[1] === '1' || dest[1] === '8')) {
            setPromoting({ p: toMove, dest: dest })
          } else {
            props.playMove(toMove.coords, dest)
          }
        }
      }
    }
  }

  const getPromoteClick = () => {
    return (promoType: PieceT) => {
      if (typeof promoting === 'undefined') {
        throw new Error('Cannot promote undefined piece')
      }
      props.playMove(promoting.p.coords, promoting.dest, promoType)
      setPromoting(undefined)
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
    <div className='flex-row'>
      <div>
        <table>
          <tbody>
            {inds.map((i) => {
              return (
                <tr key={i}>
                  {inds.map((j) => {
                    const square = board.board[getInd(i)][getInd(j)]
                    const selected = isSelected[i][j]
                    const notation = indicesToNotation(getInd(i), getInd(j))
                    const highlight = (
                      (
                        typeof legalMoves !== 'undefined' &&
                        legalMoves.has(notation)
                      ) ||
                      (
                        props.game.board.movePointer >= 0 &&
                        (
                          props.game.board.lastMove.from === notation ||
                          props.game.board.lastMove.to === notation
                        )
                      )
                    )
                    let className = (i + j) % 2 === 0 ? "white-square" : "black-square"
                    if (highlight) className += ' highlighted'
                    return (
                      <td
                        key={j} 
                        className={className}
                      >
                        <button 
                          onClick={getOnClick(i, j)}
                          className="button-square"
                        >
                          {
                            square !== null &&
                            <PieceComponent 
                              piece={square} 
                              selected={selected}
                            />
                          }
                        </button>
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

      {
        promoting && 
        <PromotionSelector turn={props.game.turn} onSelected={getPromoteClick()} />
      }
    </div>
  )
}

export default BoardComponent

