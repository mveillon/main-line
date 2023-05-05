import { Piece } from "./pieces/Piece"

/**
 * All information needed to undo a move
 */
export type MoveInfo = {
  from: string,
  to: string,
  captured: Piece | null,
  hadMoved: boolean,
  promoted: boolean,
  enPassant: boolean
}
