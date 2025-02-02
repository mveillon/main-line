import COLOR from "../Color"
import { Board } from "../Board"
import { indicesToNotation, notationToIndices } from "../notationIndices";
import { addArrays } from "../../utils/numJS";

export type PieceT = new (color: COLOR, coords: string, board: Board) => Piece

export abstract class Piece {
  readonly color: COLOR
  coords: string
  abstract readonly whiteEmoji: string
  abstract readonly blackEmoji: string
  protected _board: Board
  hasMoved = false
  abstract readonly type: PieceT

  /**
   * A piece on the board
   * @param _color who owns the piece
   * @param _coords the algebraic coordinates of the piece
   * @param board a pointer to the board its on
   */
  constructor(color: COLOR, coords: string, board: Board) {
    this.color = color
    this.coords = coords
    this._board = board
  }

  /**
   * Finds all moves the piece can go to, without checking if
   * the move will put the king in check
   * @returns a set of all available moves
   */
  abstract legalMovesNoChecks(): Set<string>;

  /**
   * Finds all of the piece's legal moves, including checking if they 
   * put the king in check
   * TODO : store these moves after calculating them to not have to
   * recalculate multiple times in the same move
   * @returns the set of legal moves of the piece
   */
  legalMoves(): Set<string> {
    const res = this.legalMovesNoChecks()

    for (const move of res) {
      if (this._board.putsKingInCheck(this.coords, move)) {
        res.delete(move)
      }
    }

    return res
  }

  /**
   * Pieces that move in infinite straight lines (bishops, rooks, queens)
   * can use this helper method to find their legal moves just by providing
   * in which directions the piece can move
   * @param direcs direction vectors that represent which ways the piece can move
   * @returns all possible moves the piece can make not counting checks
   */
  protected _infiniteMoves(direcs: [number, number][]): Set<string> {
    const res: Set<string> = new Set()
    const current = notationToIndices(this.coords)

    for (const d of direcs) {
      let checking = (addArrays(current, d) as [number, number])
      while (!this._board.blockedOOB(checking, this.color)) {
        const notation = indicesToNotation(...checking)
        res.add(notation)

        const p = this._board.pieceAt(notation)
        if (p !== null && p.color !== this.color) {
          break
        }
        checking = (addArrays(checking, d) as [number, number])
      }
      
    }
    res.delete(this.coords)

    return res
  }

  /**
   * Pieces that move only once towards a given direction (kings, knights)
   * can use this helper function to find all their moves
   * @param direcs which directions the piece moves in
   * @returns all the piece's legal moves, not looking for checks
   */
  protected _finiteMoves(direcs: [number, number][]): Set<string> {
    const res = new Set<string>()

    const current = notationToIndices(this.coords)

    for (const d of direcs) {
      const newPos = addArrays(current, d) as [number, number]
      if (!this._board.blockedOOB(newPos, this.color)) {
        res.add(indicesToNotation(...newPos))
      }
    }

    return res
  }

  toString() {
    const cStr = this.color === COLOR.WHITE ? 'White' : 'Black'
    return `${cStr} ${this.whiteEmoji} at ${this.coords}`
  }
}
