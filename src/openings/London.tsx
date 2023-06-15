import React from "react";
import Opening from "../components/Opening";
import black from "../puzzles/London/black.json"
import white from "../puzzles/London/white.json"

/**
 * The London opening for white
 */
export const LondonWhite = () => {
  return (
    <Opening 
      name="London System" 
      puzzles={white}
    />
  )
}

/**
 * The London opening for black
 */
export const LondonBlack = () => {
  return (
    <Opening
      name="London System"
      puzzles={black}
    />
  )
}
