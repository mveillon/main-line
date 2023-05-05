import "./styling/BoardComponent.css"

import PieceComponent from "./PieceComponent";
import { Board } from "../chessLogic/Board";

const BoardComponent = (props: { board: Board }) => {
  return (
    <table>
      <tbody>
        {props.board.board.map((row, i) => {
          return (
            <tr key={i}>
              {row.map((square, j) => {
                return (
                  <td 
                    key={j} 
                    className={(i + j) % 2 === 0 ? "black-square" : "white-square"}
                  >
                    {
                      square !== null &&
                      <PieceComponent piece={square} />
                    }
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default BoardComponent

