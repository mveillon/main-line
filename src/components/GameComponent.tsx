import { useState } from "react";
import BoardComponent from "./BoardComponent";
import Game from "../chessLogic/Game";

function GameComponent() {
  const [game, setGame] = useState(new Game())
  const [result, setResult] = useState(game.result)

  const playMove = (from: string, to: string) => {
    game.playMove(from, to)
    setGame(game)
    setResult(game.result)
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
