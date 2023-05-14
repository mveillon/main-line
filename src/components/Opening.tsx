import Color from "../chessLogic/Color";
import GameComponent from "./GameComponent";

import "./styling/global.css"

function Opening(props: { name: string, pgn: string, player: Color }) {
  const c = props.player === Color.White ? 'white' : 'black'
  return (
    <div>
      <h1>{props.name}</h1>

      <p>Find the best move for {c}</p>

      <GameComponent
        pgn={props.pgn}
        player={props.player}
      />
    </div>
  )
}

export default Opening