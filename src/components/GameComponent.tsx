import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import { Engine } from "../chessLogic/Engine";
import { 
  uciToMove, 
  pieceToAcronym, 
  uciToAlgebraic, 
  uciLineToPGN 
} from "../chessLogic/parser";
import Color from "../chessLogic/Color";
import { toFEN } from "../chessLogic/fenPGN";
import "./styling/global.css"
import { PieceT } from "../chessLogic/pieces/Piece";
import loading from "../assets/loading.gif"

const DEPTH = 5
const LINE_LENGTH = 5

function GameComponent(props: { pgn: string, player: Color }) {
  let g = new Game(props.pgn)
  g.engineColors = [+!props.player]

  const [game, setGame] = useState(g)
  const [result, setResult] = useState('')
  const [review, setReview] = useState('')
  const [sf, setSF] = useState(new Engine(DEPTH, LINE_LENGTH))
  const [line, setLine] = useState('')
  const [showLine, setShowLine] = useState(false)
  const [thinking, setThinking] = useState(false)

  // quit Stockfish when component is unmounted
  useEffect(() => {
    if (game.turn !== props.player) {
      computerMove()
    }

    return () => { sf.quit() }
  }, [])

  const computerMove = async () => {
    if (!game.engineColors.includes(game.turn)) return

    setThinking(true)
    const moves = await sf.getBestMoves(toFEN(game))
    game.playMove(...uciToMove(moves[0].move))
    setGame(Object.assign(new Game(), game))
    updateRes()
    setThinking(false)
  }

  const updateRes = () => {
    const res = game.result
    switch (res) {
      case '':
        computerMove()
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
    let uci = from + to
    if (typeof promoType !== 'undefined') {
      uci += pieceToAcronym(promoType)
    }
    const algebraic = uciToAlgebraic(uci, game.board)
    const fen = toFEN(game)

    game.playMove(from, to, promoType)
    setGame(game)

    setThinking(true)
    const moves = await sf.getBestMoves(fen)
    const revParts: string[] = [algebraic]

    // TODO : check with UCI. If the player is black, will the best move
    // be moves[0]? They could just be sorted in descending order of cp in which
    // case moves[0] would the worst for black of the engine suggestions
    if (uci === moves[0].move) {
      revParts.push('is the top engine move!')
    } else {
      let found = false
      for (const move of moves) {
        if (move.move === uci) {
          revParts.push('is one of the top engine moves!')
          found = true
          break
        }
      }
      if (!found) {
        revParts.push('is not good.')
      }

      game.board.undoLastMove()
      revParts.push(`The best move is ${uciToAlgebraic(moves[0].move, game.board)}.`)
      game.board.movePiece(from, to, promoType)
    }

    const otherMoves = moves.filter(
      (m, i) => m.score > 0 && i > 0 && i < LINE_LENGTH + 1
    )
    if (otherMoves.length > 0) {
      game.board.undoLastMove()
      revParts.push('Sidelines include')
      const moveStr: string[] = otherMoves.map(
        m => uciToAlgebraic(m.move, game.board)
      )
      moveStr[moveStr.length - 1] = 'and ' + moveStr[moveStr.length - 1]
      revParts.push(moveStr.join(', ') + '.')
      game.board.movePiece(from, to, promoType)
    }
    setReview(revParts.join(' '))

    game.board.undoLastMove()
    const pgn = uciLineToPGN([moves[0].move, ...moves[0].line], game)
    game.board.movePiece(from, to, promoType)
    setLine(pgn)

    updateRes()
    setThinking(false)
  }

  return (
    <div className='flex-row'>
      <div>
        <BoardComponent game={game} playMove={playMove} player={props.player} />
        <p>{result}</p>
      </div>

      <div>
        {
          thinking &&
          <img src={loading} alt='thinking...' height='50px' width='50px' />
        }
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
                showLine &&
                'Hide line'
              }
              {
                !showLine &&
                'Show line'
              }
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default GameComponent
