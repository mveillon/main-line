import Opening from "../components/Opening";
import black from "../puzzles/Caro-Kann/black.json"
import white from "../puzzles/Caro-Kann/white.json"

/**
 * The Caro-Kann opening for black
 */
export const CaroKannBlack = () => {
  return (
    <Opening 
        name="Caro-Kann" 
        puzzles={black}
      />
  )
}

/**
 * The Caro-Kann opening for white
 */
export const CaroKannWhite = () => {
  return (
    <Opening
      name="Caro-Kann"
      puzzles={white}
    />
  )
}
