import Opening from "../components/Opening";
import Color from "../chessLogic/Color";

const Testing = () => {
  return (
    <Opening
      name='Testing'
      pgn={`
        [Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        
        1. e4 f5 2. exf5 g6 3. fxg6 Nc6 4. gxh7 Nb8 *
      `}
      player={Color.White}
    />
  )
}

export default Testing