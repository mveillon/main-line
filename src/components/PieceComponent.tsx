import { Piece } from "../chessLogic/pieces/Piece";
import COLOR from "../chessLogic/Color";
import "./styling/PieceComponent.css"
import "./styling/global.css"
import { useState } from "react";

import blackBishop from "../assets/blackBishop.png"
import blackKing from "../assets/blackKing.png"
import blackKnight from "../assets/blackKnight.png"
import blackPawn from "../assets/blackPawn.png"
import blackQueen from "../assets/blackQueen.png"
import blackRook from "../assets/blackRook.png"
import whiteBishop from "../assets/whiteBishop.png"
import whiteKing from "../assets/whiteKing.png"
import whiteKnight from "../assets/whiteKnight.png"
import whitePawn from "../assets/whitePawn.png"
import whiteQueen from "../assets/whiteQueen.png"
import whiteRook from "../assets/whiteRook.png"

/**
 * Returns a link to the image that corresponds to the given piece
 * @param piece the piece to render
 * @returns an image of that piece
 */
const pieceToSrc = (piece: Piece): string => {
  const name = piece.type.name
  const color = piece.color === COLOR.WHITE ? 'white' : 'black'

  const pieces: { [index: string]: string } = {
    blackBishop: blackBishop,
    blackKing: blackKing,
    blackKnight: blackKnight,
    blackPawn: blackPawn,
    blackQueen: blackQueen,
    blackRook: blackRook,
    whiteBishop: whiteBishop,
    whiteKing: whiteKing,
    whiteKnight: whiteKnight,
    whitePawn: whitePawn,
    whiteQueen: whiteQueen,
    whiteRook: whiteRook
  }

  return pieces[color + name]
}

/**
 * One piece on the board
 * @param piece the piece ro render
 * @param selected whether the piece is currently selected and should float
 * with the player's mouse
 * @returns 
 */
const PieceComponent = (props: { piece: Piece, selected: boolean }) => {
  const src = pieceToSrc(props.piece)

  const [style, setStyle] = useState({})

  if (props.selected) {
    window.onmousemove = (e) => {
      setStyle({
        position: 'absolute',
        zIndex: 5,
        top: e.pageY - 10,
        left: e.pageX - 10,
        pointerEvents: 'none'
      })
    }
  }

  return (
    <img 
      src={src} 
      className="piece-img" 
      alt='piece' 
      style={props.selected ? style : undefined} 
    />
  )
}

export default PieceComponent
