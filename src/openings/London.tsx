import Opening from "../components/Opening";
import black from "../puzzles/London/black.json"
import white from "../puzzles/London/white.json"

const PGN = '1. d4 d5 2. Bf4'

export const LondonWhite = () => {
  return (
    <Opening 
        name="London System" 
        pgn={PGN}
        puzzles={white}
      />
  )
}

export const LondonBlack = () => {
  return (
    <Opening
      name="London System"
      pgn={PGN}
      puzzles={black}
    />
  )
}
