import Opening from "../components/Opening";

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
        
        1. e4 d5 2. Nf3 Nc6 3. Bd3 Bf5 4. Nc3 Qd6 *
      `}
      puzzles={{}}
    />
  )
}

export default Testing