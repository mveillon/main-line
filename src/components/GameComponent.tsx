import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import { Engine } from "../chessLogic/Engine";
import { uciToMove, pieceToAcronym, uciToAlgebraic } from "../chessLogic/parser";
import Color from "../chessLogic/Color";

import "./styling/global.css"
import { PieceT } from "../chessLogic/pieces/Piece";

function GameComponent(props: { pgn: string, player: Color }) {
  const g = new Game(props.pgn)
  g.engineColors = [+!props.player]

  const [game, setGame] = useState(g)
  const [result, setResult] = useState('')
  const [review, setReview] = useState('')
  const [sf, setSF] = useState(new Engine(5, 5))

  // quit Stockfish when component is unmounted
  useEffect(() => {
    return () => { sf.quit() }
  }, [])

  const computerMove = async () => {
    if (!game.engineColors.includes(game.turn)) return

    const moves = await sf.getBestMoves(game.toFEN())
    game.playMove(...uciToMove(moves[0].move))
    setGame(Object.assign(new Game(), game))
    setResult(game.result)
  }

  const playMove = async (from: string, to: string, promoType?: PieceT) => {
    let uci = from + to
    if (typeof promoType !== 'undefined') {
      uci += pieceToAcronym(promoType)
    }
    const algebraic = uciToAlgebraic(uci, game.board)
    const fen = game.toFEN()

    game.playMove(from, to, promoType)
    setGame(game)

    const moves = await sf.getBestMoves(fen)
    const revParts: string[] = [algebraic]

    if (uci === moves[0].move) {
      revParts.push('is the top engine move!')
    } else {
      let found = false
      for (const move of moves) {
        if (move.move === uci) {
          if (move.score > 0) {
            revParts.push('is a top engine move!')
          } else {
            revParts.push('is ok, but not the best.')
          }
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

    setReview(revParts.join(' '))

    if (game.result === '') {
      computerMove()
    } else {
      if (game.result === '1-0') {
        setResult('White wins by checkmate')
      } else if (game.result === '0-1') {
        setResult('Black wins by checkmate')
      } else if (game.result === '1/2-1/2') {
        setResult('Draw by stalemate')
      }
    }
  }

  if (game.turn !== props.player) {
    computerMove()
  }

  return (
    <div className='flex-row'>
      <div>
        <BoardComponent game={game} playMove={playMove} player={props.player} />
        <p>{result}</p>
      </div>

      <p>{review}</p>
    </div>
  )
}

export default GameComponent
