import { Piece } from "../chessLogic/pieces/Piece";
import Color from "../chessLogic/Color";
import "./styling/PieceComponent.css"

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
  const name = piece.constructor.name
  const color = piece.color === Color.White ? 'white' : 'black'

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

const PieceComponent = (props: { piece: Piece }) => {
  const src = pieceToSrc(props.piece)

  return (
    <img src={src} className="piece-img" alt='piece' />
  )
}

export default PieceComponent
