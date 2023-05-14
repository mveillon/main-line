import Opening from "../components/Opening";
import Color from "../chessLogic/Color";

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
        player={Color.White}
      />
  )
}

export default London