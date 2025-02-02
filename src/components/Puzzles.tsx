import React from "react";
import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import "./styling/global.css"
import { PieceT } from "../chessLogic/pieces/Piece";
import PuzzleSet from "../puzzles/PuzzleSet";
import { choice } from "../utils/random";
import { pieceToAcronym, uciToAlgebraic, uciToMove } from "../chessLogic/parser";
import { uciLineToPGN } from "../chessLogic/parser";
import COLOR from "../chessLogic/Color";
import { fenToParts, toFEN } from "../chessLogic/fenPGN";
import { useNavigate } from "react-router-dom";

/**
 * The controller allowing the player to play all the puzzles in `puzzles`
 * @param puzzles the puzzles the player can play
 */
function Puzzles(props: { 
  puzzles: PuzzleSet
}) {
  // clear out moves made because it breaks the back button
  const g2 = new Game()

  const aPuzzle = Object.keys(props.puzzles)[0]
  let player: COLOR
  if (typeof aPuzzle === 'undefined' || fenToParts(aPuzzle).turn === 'w') {
    player = COLOR.WHITE
  } else {
    player = COLOR.BLACK
  }

  const [game, setGame] = useState(g2)
  const [result, setResult] = useState('')
  const [review, setReview] = useState('')
  const [line, setLine] = useState('')
  const [showLine, setShowLine] = useState(false)
  const [currentFEN, setCurrentFEN] = useState('')
  const [available, setAvailable] = useState(new Set(Object.keys(props.puzzles)))
  const [canMove, setCanMove] = useState(false)

  useEffect(() => {
    pickNextPuzzle()
  }, [])

  const updateGame = () => {
    // so inefficient but required because React doesn't notice deep
    // state changes
    setGame(Object.assign({}, game))
  }

  const updateRes = () => {
    const res = game.result
    switch (res) {
      case '':
        break
      case '1-0':
        setResult('White wins by checkmate')
        break
      case '0-1':
        setResult('Black wins by checkmate')
        break
      case '1/2-1/2':
        setResult('Draw by stalemate')
        break
      default:
        throw new Error(`Unrecognized game result ${res}`)
    }
  }

  const playMove = async (from: string, to: string, promoType?: PieceT) => {
    if (!canMove) return

    let uci = from + to
    if (typeof promoType !== 'undefined') {
      uci += pieceToAcronym(promoType)
    }

    const bestMove = props.puzzles[currentFEN].bestMove
    if (uci === bestMove) {
      setReview("That's the best move!")
      setLine(uciLineToPGN(
        [uci, ...props.puzzles[currentFEN].moves[uci].line],
        game
      ))
    } else {
      const score = (
        props.puzzles[currentFEN].moves[uci].score
      )
      const bestScore = props.puzzles[currentFEN].moves[bestMove].score

      const reviewParts: string[] = []

      if (Math.abs(score - bestScore) < 30) {
        reviewParts.push("That's one of the best moves!")
      } else {
        reviewParts.push("That's not the right idea.")
      }

      reviewParts.push(`The top move is ${uciToAlgebraic(bestMove, game.board)}.`)

      const newLine = uciLineToPGN(
        [bestMove, ...props.puzzles[currentFEN].moves[bestMove].line],
        game
      )
      setLine(newLine)
      setReview(reviewParts.join(' '))
    }

    game.playMove(from, to, promoType)

    updateGame()
    updateRes()
    setCanMove(false)

    let movePointer = 0
    const moveLine = props.puzzles[currentFEN].moves[uci].line
    const movePlayer = setInterval(() => {
      if (movePointer === moveLine.length) {
        clearInterval(movePlayer)
      } else {
        game.playMove(...uciToMove(moveLine[movePointer++]))
        updateGame()
        updateRes()
      }
    }, 1000)
  }

  const updatePuzzle = (puzzle: string) => {
    setCurrentFEN(puzzle)
    setGame(new Game(undefined, puzzle))
    setCanMove(true)
  }

  const pickNextPuzzle = () => {
    const nextPuzzle = choice(Array.from(available))
    available.delete(nextPuzzle)
    setAvailable(available)
    updatePuzzle(nextPuzzle)
    setLine('')
    setReview('')
  }

  const backwardOneMove = () => {
    if (game.board.backwardOneMove()) {
      game.turn = +!game.turn
      updateGame()
    }
  }

  const forwardOneMove = () => {
    if (game.board.forwardOneMove()) {
      game.turn = +!game.turn
      updateGame()
    }
  }

  const navigate = useNavigate()
  const toAnalysis = () => {
    navigate(
      "/analysis",
      {state: {
        fen: toFEN(game),
        player: player
      }}
    )
  }

  return (
    <div className='flex-row'>
      <div>
        <BoardComponent 
          game={game} 
          playMove={playMove}
          perspective={player} 
          canMove={canMove}
        />
        <p>{result}</p>
        {
          available.size > 0 ?
            <button onClick={pickNextPuzzle}>Next Puzzle</button> :
            <p>No puzzles remaining!</p>
        }
        <button onClick={toAnalysis}>Analysis Board</button>
      </div>

      <div>
        <p>{review}</p>
        {
          line !== '' &&
          <div>
            {
              showLine &&
              <p>{line}</p>
            }

            <button onClick={() => setShowLine(!showLine)}>
              {
                showLine ? 'Hide line' : 'Show line'
              }
            </button>

            <br></br>
            <button 
              className="forward-back"
              onClick={backwardOneMove}
            >
              {"<"}
            </button>
            <button
              className="forward-back"
              onClick={forwardOneMove}
            >
              {">"}
            </button>

            <br></br>
            <button onClick={() => updatePuzzle(currentFEN)}>
              Try another move!
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Puzzles
