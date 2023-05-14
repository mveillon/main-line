import Color from "../chessLogic/Color";
import GameComponent from "./GameComponent";

import "./styling/global.css"

function Opening(props: { name: string, pgn: string, player: Color }) {
  return (
    <div>
      <h1>{props.name}</h1>

      <GameComponent
        pgn={props.pgn}
        player={props.player}
      />
    </div>
  )
}

export default Opening