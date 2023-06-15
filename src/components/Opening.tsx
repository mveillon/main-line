import React from "react";
import Puzzles from "./Puzzles";
import PuzzleSet from "../puzzles/PuzzleSet";
import { useNavigate } from "react-router-dom";

import "./styling/global.css"
import { fenToParts } from "../chessLogic/fenPGN";

/**
 * A single opening
 * @param name the name of the opening
 * @param puzzles the puzzles the player can play
 */
function Opening(props: { 
  name: string, 
  puzzles: PuzzleSet
}) {
  const aPuzzle = Object.keys(props.puzzles)[0]
  let c: string
  if (typeof aPuzzle === 'undefined' || fenToParts(aPuzzle).turn === 'w') {
    c = 'white'
  } else {
    c = 'black'
  }

  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate("/")}>Go back</button>
      <h1>{props.name}</h1>

      <p>Find the best move for {c}</p>

      <Puzzles
        puzzles={props.puzzles}
      />
    </div>
  )
}

export default Opening