import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import { Engine } from "../chessLogic/Engine";
import { uciToMove } from "../chessLogic/parser";
import Color from "../chessLogic/Color";

import "./styling/global.css"
import { PieceT } from "../chessLogic/pieces/Piece";

function GameComponent(props: { pgn: string, player: Color }) {
  const g = new Game(props.pgn)
  // g.engineColors = [+!props.player]

  const [game, setGame] = useState(g)
  const [result, setResult] = useState('')
  const [review, setReview] = useState('')

  const sf = new Engine(5, 1)

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

  const playMove = (from: string, to: string, promoType?: PieceT) => {
    game.playMove(from, to, promoType)
    setGame(game)

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
