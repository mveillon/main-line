import { Piece, PieceT } from "./pieces/Piece"

/**
 * All information needed to undo a move
 */
export interface MoveInfo {
  from: string,
  to: string,
  captured: Piece | null,
  hadMoved: boolean,
  promoType?: PieceT,
  enPassant: boolean,
  pieceMoved: Piece
}
