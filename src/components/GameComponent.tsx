import { useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import "./styling/global.css"
import { PieceT } from "../chessLogic/pieces/Piece";
import PuzzleSet from "../puzzles/PuzzleSet";
import { choice } from "../utils/random";
import { pieceToAcronym, uciToAlgebraic, uciToMove } from "../chessLogic/parser";
import { isClose } from "../utils/numJS";
import { uciLineToPGN } from "../chessLogic/parser";
import Color from "../chessLogic/Color";

function GameComponent(props: { 
  pgn: string,
  puzzles: PuzzleSet
}) {
  let g = new Game(props.pgn)

  const aPuzzle = Object.keys(props.puzzles)[0]
  let player: Color
  if (typeof aPuzzle === 'undefined' || aPuzzle.split(' ')[1] === 'w') {
    player = Color.White
  } else {
    player = Color.Black
  }

  const [game, setGame] = useState(g)
  const [result, setResult] = useState('')
  const [review, setReview] = useState('')
  const [line, setLine] = useState('')
  const [showLine, setShowLine] = useState(false)
  const [currentFEN, setCurrentFEN] = useState('')
  const [available, setAvailable] = useState(new Set(Object.keys(props.puzzles)))
  const [canMove, setCanMove] = useState(false)
  const [disableSkip, setDisableSkip] = useState(false)

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
    } else {
      const score = (
        props.puzzles[currentFEN].moves[uci].score
      )
      const bestScore = props.puzzles[currentFEN].moves[bestMove].score

      const reviewParts: string[] = []

      if (isClose(score, bestScore, undefined, 0.2)) {
        reviewParts.push("That's one of the best moves!")
      } else {
        reviewParts.push("That's not the right idea.")
      }

      reviewParts.push(`The top move is ${uciToAlgebraic(bestMove, game.board)}.`)

      const line = uciLineToPGN(
        [bestMove, ...props.puzzles[currentFEN].moves[bestMove].line],
        game
      )
      setLine(line)
      setReview(reviewParts.join(' '))
    }

    game.playMove(from, to, promoType)

    updateGame()
    updateRes()
    setCanMove(false)

    let movePointer = 0
    const line = props.puzzles[currentFEN].moves[uci].line
    const movePlayer = setInterval(() => {
      if (movePointer === line.length) {
        clearInterval(movePlayer)
      } else {
        game.playMove(...uciToMove(line[movePointer++]))
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
  }

  const backwardOneMove = () => {
    setDisableSkip(true)
    if (game.board.backwardOneMove()) {
      game.turn = +!game.turn
      updateGame()
    }
    setDisableSkip(false)
  }

  const forwardOneMove = () => {
    setDisableSkip(true)
    if (game.board.forwardOneMove()) {
      game.turn = +!game.turn
      updateGame()
    }
    setDisableSkip(false)
  }

  return (
    <div className='flex-row'>
      <div>
        <BoardComponent 
          game={game} 
          playMove={playMove}
          player={player} 
          canMove={canMove}
        />
        <p>{result}</p>
        {
          available.size > 0 ?
          <button onClick={pickNextPuzzle}>Next Puzzle</button> :
          <p>No puzzles remaining!</p>
        }
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
              disabled={disableSkip}
            >
              {"<"}
            </button>
            <button
              className="forward-back"
              onClick={forwardOneMove}
              disabled={disableSkip}
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

export default GameComponent
