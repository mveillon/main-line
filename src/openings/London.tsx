import Opening from "../components/Opening";
import puzzles from "../puzzles/London.json"

const London = () => {
  return (
    <Opening 
        name="London System" 
        pgn={`
              [Event "?"]
              [Site "?"]
              [Date "????.??.??"]
              [Round "?"]
              [White "?"]
              [Black "?"]
              [Result "*"]

              1. d4 d5 2. Bf4 *
            `}
        puzzles={puzzles}
      />
  )
}

export default London