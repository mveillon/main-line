import React, { useState } from "react";
import { Board } from "../chessLogic/Board";
import BoardComponent from "./BoardComponent";

function GameComponent() {
  const [board, setBoard] = useState(new Board())

  return (
    <div>
      <BoardComponent board={board} />
    </div>
  )
}

export default GameComponent
