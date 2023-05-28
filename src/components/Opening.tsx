import GameComponent from "./GameComponent";
import PuzzleSet from "../puzzles/PuzzleSet";
import { useNavigate } from "react-router-dom";

import "../styling/global.css"
import { fenToParts } from "../chessLogic/fenPGN";

function Opening(props: { 
  name: string, 
  pgn: string, 
  puzzles: PuzzleSet
}) {
  const aPuzzle = Object.keys(props.puzzles)[0]
  let c: string
  if (typeof aPuzzle === 'undefined' || fenToParts(aPuzzle)[1] === 'w') {
    c = 'white'
  } else {
    c = 'black'
  }

  const navigate = useNavigate()
  const navBack = () => {
    navigate('/')
  }

  return (
    <div>
      <button onClick={navBack}>Go back</button>
      <h1>{props.name}</h1>

      <p>Find the best move for {c}</p>

      <GameComponent
        pgn={props.pgn}
        puzzles={props.puzzles}
      />
    </div>
  )
}

export default Opening