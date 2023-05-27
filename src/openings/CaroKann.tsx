import Opening from "../components/Opening";
import puzzles from "../puzzles/Caro-Kann.json"

const CaroKann = () => {
  return (
    <Opening 
        name="Caro-Kann" 
        pgn={`
              [Event "?"]
              [Site "?"]
              [Date "????.??.??"]
              [Round "?"]
              [White "?"]
              [Black "?"]
              [Result "*"]

              1. e4 c6 2. d4 d5 *
            `}
        puzzles={puzzles}
      />
  )
}

export default CaroKann