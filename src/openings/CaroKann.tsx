import Opening from "../components/Opening";
import black from "../puzzles/Caro-Kann/black.json"
import white from "../puzzles/Caro-Kann/white.json"

const PGN = '1. e4 c6 2. d4 d5'

export const CaroKannBlack = () => {
  return (
    <Opening 
        name="Caro-Kann" 
        pgn={PGN}
        puzzles={black}
      />
  )
}

export const CaroKannWhite = () => {
  return (
    <Opening
      name="Caro-Kann"
      pgn={PGN}
      puzzles={white}
    />
  )
}
