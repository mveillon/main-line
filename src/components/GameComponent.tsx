import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import { Engine } from "../chessLogic/Engine";
import { uciToMove } from "../chessLogic/parser";
import Color from "../chessLogic/Color";

function GameComponent(props: { pgn: string, player: Color }) {
  const g = new Game(props.pgn)
  if (typeof props.player !== 'undefined') {
    g.engineColors = [+!props.player]
  }

  const [game, setGame] = useState(g)
  const [result, setResult] = useState(game.result)

  const sf = new Engine(5, 1)

  // quit Stockfish when component is unmounted
  useEffect(() => {
    return () => { sf.quit() }
  }, [])

  const computerMove = async () => {
    const moves = await sf.getBestMoves(game.toFEN())
    game.playMove(...uciToMove(moves[0].move))
    setGame(Object.assign(new Game(), game))
    setResult(game.result)
  }

  const playMove = (from: string, to: string) => {
    game.playMove(from, to)
    setGame(game)
    setResult(game.result)

    if (game.result === '') {
      computerMove()
    }
  }

  if (game.turn !== props.player) {
    computerMove()
  }

  return (
    <div>
      <BoardComponent game={game} playMove={playMove} player={props.player} />
      {
        result === '0-1' &&
        <p>Checkmate! Black wins!</p>
      }
      {
        result === '1-0' &&
        <p>Checkmate! White wins!</p>
      }
      {
        result === '1/2-1/2' &&
        <p>It's a draw!</p>
      }
    </div>
  )
}

export default GameComponent
