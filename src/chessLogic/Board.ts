import { Piece, PieceT } from "./pieces/Piece"
import Color from "./Color"
import startingPosition from "./startingPosition"
import { notationToIndices } from "./notationIndices"
import King from "./pieces/King"
import Pawn from "./pieces/Pawn"
import type { MoveInfo } from "./MoveInfo"
import { doubleMove } from "./parser"

/**
 * An array of pieces. An empty square is `null`. A `BoardT`[0] refers
 * to the 1st rank, and `BoardT`[5][0] represents square h6. In other words,
 * if you print the contents of the board, you will be looking at it from
 * black's perspective
 */
export type BoardT = (Piece | null)[][]

export class Board {
  protected _board: BoardT
  public get board() : BoardT {
    return this._board
  }
  movesMade: MoveInfo[]

  public get lastMove(): MoveInfo {
    return this.movesMade[this.movesMade.length - 1]
  }

  constructor(pgn?: string) {
    this._board = startingPosition(this)
    this.movesMade = []

    if (typeof pgn !== 'undefined') {
      const r = /[0-9]+\./ // matches the move numbers

      // matches parenthesis and text between them. Also matches
      // curly braces and square braces
      // modified from https://stackoverflow.com/questions/640001/how-can-i-remove-text-within-parentheses-with-a-regex
      const paren = /(\(|\{|\[).*(\)|\}|\])/gm

      // matches the game result e.g. 0-1 or 1-0
      const result = /(0-1|1-0|1\/2-1\/2)/

      const asterisk = /\*/

      pgn = pgn.replace(paren, '')
      pgn = pgn.replace(result, '')
      pgn = pgn.replace(asterisk, '')

      const moves = pgn.split(r)

      for (let i = 1; i < moves.length; i++) {
        doubleMove(moves[i].trim(), this)
      }
    }
  }

  toString(): string {
    const line: string = '   --- --- --- --- --- --- --- --- '
    let rows: string[] = [line]
    for (let i = this.board.length - 1; i >= 0; i--) {
      let current: string[] = [`${i + 1} |`]
      for (let j = this.board[i].length - 1; j >= 0; j--) {
        const square = this.board[i][j]
        current.push(' ')
        if (square === null) {
          current.push(' ')
        } else {
          if (square.color === Color.White) {
            current.push(square.whiteEmoji)
          } else {
            current.push(square.blackEmoji)
          }
        }
        current.push(' ')
        current.push('|')
      }
      rows.push(current.join(''))
      rows.push(line)
    }
    rows.push('    a   b   c   d   e   f   g   h  ')
    return rows.join('\n')
  }

  /**
   * Finds the piece at the given coordinates.
   * Coordinates should be in chess notation e.g. h5
   * @param coords the coordinates of the square
   * @returns the piece at that square, or null if the square is empty
   */
  pieceAt(coords: string): Piece | null {
    const [i, j] = notationToIndices(coords)
    return this.board[i][j]
  }

  /**
   * Finds all of `color`'s pieces of the given `pieceType` e.g. all of
   * white's knights
   * TODO : this should be more efficient ideally. Right now it's `O(n^2)`
   * @param pieceType which type the piece is
   * @param color who owns the piece
   * @param file optional param for which file the piece should be on
   * @param rank optional param for which rank the piece should be on
   * @returns a list of all the matching pieces
   */
  findPieces(
    pieceType: typeof Piece, 
    color: Color, 
    file?: string, 
    rank?: string): Piece[] {

    let res: Piece[] = []
    for (const row of this.board) {
      for (const square of row) {
        if (
          square !== null && 
          square instanceof pieceType && 
          square.color === color &&
          (typeof file === "undefined" || square.coords[0] === file) &&
          (typeof rank === "undefined" || square.coords[1] === rank)
        ) {
          res.push(square)
        }
      }
    }

    return res
  }

  /**
   * Moves the piece at `from` to `to`, regardless of whether it's legal
   * @param from the starting square
   * @param to the ending square
   * @param sideEffects whether or not to update the piece's hasMoved
   * @param promoteType what type of piece to promote to if the move
   * promotes a pawn
   * field and promote pawns. Good to turn off if making a hypothetical move
   */
  movePiece(
    from: string, 
    to: string, 
    sideEffects: boolean = true,
    promoteType?: PieceT) {

    if (to === 'O-O' || to === 'O-O-O') {
      throw new Error(
        'To castle, move the king from the e file to either the c or g file'
      )
    }

    const [fromI, fromJ] = notationToIndices(from)
    const [toI, toJ] = notationToIndices(to)
    const p = this._board[fromI][fromJ]
    if (p === null) {
      throw new Error(`${from} is an empty square`)
    }

    const info: MoveInfo = {
      from: from,
      to: to,
      captured: this.pieceAt(to),
      hadMoved: p.hasMoved,
      promoted: false,
      enPassant: (
        p instanceof Pawn &&
        toJ !== fromJ &&
        this.pieceAt(to) === null
      ),
      pieceMoved: p
    }

    if (
      sideEffects &&
      p instanceof King && 
      p.coords[0] === 'e' && 
      (to[0] === 'c' || to[0] === 'g')
    ) {
      const rookFile = to[0] === 'c' ? 'a' : 'h'
      const rook = this.pieceAt(rookFile + p.coords[1])
      if (rook === null) {
        throw new Error('No rook to castle with!')
      }

      const newRookFile = to[0] === 'c' ? 'd' : 'f'

      this.movePiece(rook.coords, newRookFile + to[1], sideEffects, promoteType)
    }

    this._board[toI][toJ] = p
    this._board[fromI][fromJ] = null
    p.coords = to

    if (sideEffects && p instanceof Pawn && (toI === 0 || toI === 7)) {
      if (typeof promoteType === 'undefined') {
        throw new Error(
          `Undefined promotion type for promoting move when moving ${from} to ${to}`
        )
      }
      this._promotePawn(p, promoteType)
      info.promoted = true
    }

    if (sideEffects) {
      p.hasMoved = true
      if (info.enPassant) {
        info.captured = this._board[fromI][toJ]
        this._board[fromI][toJ] = null
      }
      this.movesMade.push(info)
    }
  }

  /**
   * Promotes the pawn into the given promoteType
   * @param pawn the pawn to promote. Should already be on the final rank
   * @param promoteType what type to promote to e.g. Queen or Knight
   */
  protected _promotePawn(pawn: Pawn, promoteType: PieceT) {
    const [i, j] = notationToIndices(pawn.coords)
    this._board[i][j] = new promoteType(pawn.color, pawn.coords, this)
  }

  /**
   * Checks whether a piece can move to the given square as
   * long as the piece would be able to move there if it was
   * empty. Specifically checks if the player already has a piece
   * there or if the square is out of bounds
   * @param coords the coords to move to
   * @param color whose turn it is
   * @returns whether the square is out of bounds and unoccupied or
   * occupied by an opposing piece. `true` if the square is blocked,
   * `false` otherwise
   */
  blockedOOB(coords: [number, number], color: Color): boolean {
    if (
      coords[0] < 0 || coords[0] >= this._board.length ||
      coords[1] < 0 || coords[1] >= this._board[0].length
    ) {
      return true
    }

    const p = this._board[coords[0]][coords[1]]
    return p !== null && p.color === color
  }

  /**
   * Checks whether, after moving the piece at `from` to `to`, whether 
   * the king would be in check. Assumes the piece moving matches the 
   * king that would be checked. 
   * @param from the position the piece is moving from. 
   * @param to the position the piece is moving to
   * @returns whether the move would put the king in check
   */
  putsKingInCheck(from: string, to: string): boolean {
    const p = this.pieceAt(from)
    if (p === null) {
      throw new Error(`${from} is an empty square`)
    }

    const oldPiece = this.pieceAt(to)
    this.movePiece(from, to, false)

    const backToNormal = () => {
      this.movePiece(to, from, false)
      const [i, j] = notationToIndices(to)
      this._board[i][j] = oldPiece
    }

    const opposingColor = +!p.color
    const kingPos = this.findPieces(King, p.color)[0].coords

    for (const row of this._board) {
      for (const square of row) {
        if (
          square !== null && 
          square.color === opposingColor && 
          square.legalMovesNoChecks().has(kingPos)
        ) {
          backToNormal()
          return true
        }
      }
    }

    backToNormal()
    return false
  }

  /**
   * Checks whether the two boards have the pieces in the same position.
   * Does not check whose turn it is or who still has castling rights
   * @param b2 the other board to check
   * @returns whether the two boards are the same
   */
  sameBoard(b2: Board): boolean {
    return this.toString() === b2.toString()
  }

  /**
   * Returns whether the `color` king is currently in check
   * @param color which king to look at
   * @returns whether that king is in check
   */
  isInCheck(color: Color): boolean {
    const kingPos = this.findPieces(King, color)[0].coords
    const tempSquare = 'a1'
    const oldPiece = this.pieceAt(tempSquare)

    this.movePiece(kingPos, tempSquare, false)
    const res = this.putsKingInCheck(tempSquare, kingPos)
    this.movePiece(tempSquare, kingPos, false)
    
    const [i, j] = notationToIndices(tempSquare)
    this._board[i][j] = oldPiece
    return res
  }
}
