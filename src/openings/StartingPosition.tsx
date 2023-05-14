import Opening from "../components/Opening";
import Color from "../chessLogic/Color";

const StartingPosition = () => {
  return (
    <Opening
      name='Chess'
      pgn=''
      player={Color.White}
    />
  )
}

export default StartingPosition
