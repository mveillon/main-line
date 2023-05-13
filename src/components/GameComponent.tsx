import { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";
import { Engine } from "../chessLogic/Engine";
import { uciToMove } from "../chessLogic/parser";

function GameComponent() {
  const [game, setGame] = useState(new Game())
  const [result, setResult] = useState(game.result)

  const sf = new Engine(5, 1)

  // quit Stockfish when component is unmounted
  useEffect(() => {
    return () => { sf.quit() }
  }, [])

  const playMove = async (from: string, to: string) => {
    game.playMove(from, to)
    setGame(game)
    setResult(game.result)

    if (game.result === '') {
      const moves = await sf.getBestMoves(game.toFEN())
      game.playMove(...uciToMove(moves[0].move))
      setGame(Object.assign(new Game(), game))
      setResult(game.result)
    }
  }

  return (
    <div>
      <BoardComponent game={game} playMove={playMove} />
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
