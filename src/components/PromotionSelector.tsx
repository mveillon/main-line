import React from "react"
import "./styling/global.css"
import "./styling/PromotionSelector.css"

import blackBishop from "../assets/blackBishop.png"
import blackKnight from "../assets/blackKnight.png"
import blackQueen from "../assets/blackQueen.png"
import blackRook from "../assets/blackRook.png"
import whiteBishop from "../assets/whiteBishop.png"
import whiteKnight from "../assets/whiteKnight.png"
import whiteQueen from "../assets/whiteQueen.png"
import whiteRook from "../assets/whiteRook.png"
import COLOR from "../chessLogic/Color"
import { PieceT } from "../chessLogic/pieces/Piece"
import Bishop from "../chessLogic/pieces/Bishop"
import Knight from "../chessLogic/pieces/Knight"
import Queen from "../chessLogic/pieces/Queen"
import Rook from "../chessLogic/pieces/Rook"

/**
 * The panel that pops up when promoting a pawn that allows the player to 
 * select what piece to promote to
 * @param turn whose turn it is
 * @param onSelected what to call when the promotion type is selected
 */
const PromotionSelector = (props: { 
  turn: COLOR, 
  onSelected: (promoType: PieceT) => void 
}) => {
  let pieces: { img: string, onClick: () => void }[]
  if (props.turn === COLOR.WHITE) {
    pieces = [
      {
        img: whiteQueen,
        onClick() { props.onSelected(Queen) }
      },
      {
        img: whiteRook,
        onClick() { props.onSelected(Rook) }
      },
      {
        img: whiteBishop,
        onClick() { props.onSelected(Bishop) }
      },
      {
        img: whiteKnight,
        onClick() { props.onSelected(Knight) }
      }
    ]
  } else {
    pieces = [
      {
        img: blackQueen,
        onClick() { props.onSelected(Queen) }
      },
      {
        img: blackRook,
        onClick() { props.onSelected(Rook) }
      },
      {
        img: blackBishop,
        onClick() { props.onSelected(Bishop) }
      },
      {
        img: blackKnight,
        onClick() { props.onSelected(Knight) }
      }
    ]
  }

  return (
    <div className='flex-row selector'>
      {
        pieces.map(p => (
          <button
            onClick={p.onClick}
            key={p.img}
          >
            <img 
              className="piece-img"
              src={p.img} 
              alt={p.img}
            />
          </button>
        ))
      }
    </div>
  )
}

export default PromotionSelector
