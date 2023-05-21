import Color from "../chessLogic/Color";
import GameComponent from "./GameComponent";
import PuzzleSet from "../puzzles/PuzzleSet";

import "./styling/global.css"

function Opening(props: { 
  name: string, 
  pgn: string, 
  puzzles: PuzzleSet
}) {
  const aPuzzle = Object.keys(props.puzzles)[0]
  let c: string
  if (typeof aPuzzle === 'undefined' || aPuzzle.split(' ')[1] === 'w') {
    c = 'white'
  } else {
    c = 'black'
  }
  return (
    <div>
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