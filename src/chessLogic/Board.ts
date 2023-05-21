import { Piece, PieceT } from "./pieces/Piece"
import Color from "./Color"
import startingPosition from "./startingPosition"
import { notationToIndices } from "./notationIndices"
import King from "./pieces/King"
import Pawn from "./pieces/Pawn"
import { MoveInfo } from "./MoveInfo"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import { fromPGN } from "./fenPGN"

/**
 * An array of pieces. An empty square is `null`. A `BoardT`[0] refers
 * to the 1st rank, and `BoardT`[5][0] represents square h6. In other words,
 * if you print the contents of the board, you will be looking at it from
 * black's perspective
 */
export type BoardT = (Piece | null)[][]

export class Board {
  board: BoardT
  movesMade: MoveInfo[]
  movePointer: number = -1

  get lastMove(): MoveInfo {
    return this.movesMade[this.movePointer]
  }

  /**
   * A board of pieces. Just handles the pieces, not whose turn it is
   * or any engine integration
   * @param pgn the starting PGN
   */
  constructor(pgn?: string) {
    this.board = startingPosition(this)
    this.movesMade = []

    if (typeof pgn !== 'undefined') {
      fromPGN(pgn, this)
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
   * @param promoteType what type of piece to promote to if the move
   * promotes a pawn
   */
  movePiece(
    from: string, 
    to: string, 
    promoteType?: PieceT
  ) {
    if (to === 'O-O' || to === 'O-O-O') {
      throw new Error(
        'To castle, move the king from the e file to either the c or g file'
      )
    }

    const [fromI, fromJ] = notationToIndices(from)
    const [toI, toJ] = notationToIndices(to)
    const p = this.board[fromI][fromJ]
    if (p === null) {
      throw new Error(`${from} is an empty square`)
    }

    const info: MoveInfo = {
      from: from,
      to: to,
      captured: this.pieceAt(to),
      hadMoved: p.hasMoved,
      promoType: promoteType,
      enPassant: (
        p instanceof Pawn &&
        toJ !== fromJ &&
        this.pieceAt(to) === null
      ),
      pieceMoved: p
    }

    if (info.enPassant) {
      info.captured = this.board[fromI][toJ]
      this.board[fromI][toJ] = null
    }

    this.movePointer++
    if (
      typeof this.lastMove === 'undefined' ||
      (this.lastMove.to !== to || this.lastMove.from !== from)
    ) {
      if (this.movePointer < this.movesMade.length) {
        this.movesMade[this.movePointer] = info
        this.movesMade.splice(this.movePointer + 1)
      } else {
        this.movesMade.push(info)
      }
    }

    if (
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

      this.movePiece(rook.coords, newRookFile + to[1], promoteType)
      this.movesMade.pop()
      this.movePointer--
    }

    this.board[toI][toJ] = p
    this.board[fromI][fromJ] = null
    p.coords = to

    if (p instanceof Pawn && (to[1] === '1' || to[1] === '8')) {
      if (typeof promoteType === 'undefined') {
        throw new Error(
          `Undefined promotion type for promoting move when moving ${from} to ${to}`
        )
      }
      this._promotePawn(p, promoteType)
    }

    p.hasMoved = true
  }

  /**
   * Promotes the pawn into the given promoteType
   * @param pawn the pawn to promote. Should already be on the final rank
   * @param promoteType what type to promote to e.g. Queen or Knight
   */
  protected _promotePawn(pawn: Pawn, promoteType: PieceT) {
    const [i, j] = notationToIndices(pawn.coords)
    this.board[i][j] = new promoteType(pawn.color, pawn.coords, this)
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
      coords[0] < 0 || coords[0] >= this.board.length ||
      coords[1] < 0 || coords[1] >= this.board[0].length
    ) {
      return true
    }

    const p = this.board[coords[0]][coords[1]]
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
    
    // promotion type doesn't matter
    this.movePiece(from, to, Queen)
    const res = this.isInCheck(p.color)
    this.undoLastMove()

    return res
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
    const otherPieces = this.findPieces(Piece, +!color)
    for (const p of otherPieces) {
      if (p.legalMovesNoChecks().has(kingPos)) {
        return true
      }
    }
    return false
  }

  /**
   * Returns whether `player` has any legal moves
   * @param player which player to check
   * @returns whether `player` can move
   */
  canMove(player: Color): boolean {
    const allPieces = this.findPieces(Piece, player)
    for (const p of allPieces) {
      if (p.legalMoves().size > 0) {
        return true
      }
    }
    return false
  }

  /**
   * Undoes the last move played, reversing all side effects
   */
  undoLastMove() {
    if (this.movePointer < 0) {
      throw new Error('Nothing to undo')
    }
    this.backwardOneMove()
    this.movesMade.splice(this.movePointer + 1)
  }

  /**
   * Skips to the next move in this.movesMade, if possible. Returns whether
   * there was a forward move to skip to
   */
  forwardOneMove() {
    const toMake = this.movesMade[this.movePointer + 1]
    if (typeof toMake !== 'undefined') {
      this.movePiece(toMake.from, toMake.to, toMake.promoType)
      return true
    }
    return false
  }

  /**
   * Skips to the most recent move in this.movesMade, if possible. Otherwise, this does
   * nothing
   */
  backwardOneMove() {
    const toUndo = this.lastMove
    this.movePointer--
    if (typeof toUndo === 'undefined') {
      return false
    }
    const [fromI, fromJ] = notationToIndices(toUndo.from)
    const [toI, toJ] = notationToIndices(toUndo.to)
    this.board[fromI][fromJ] = toUndo.pieceMoved
    toUndo.pieceMoved.coords = toUndo.from

    this.board[toI][toJ] = null
    if (toUndo.captured !== null) {
      // can't use toI and toJ because of en passant
      const [capI, capJ] = notationToIndices(toUndo.captured.coords)
      this.board[capI][capJ] = toUndo.captured
    }
    
    toUndo.pieceMoved.hasMoved = toUndo.hadMoved
    if (
      toUndo.pieceMoved instanceof King &&
      Math.abs(fromJ - toJ) > 1
    ) {
      // castling
      const rank = toUndo.pieceMoved.coords[1]
      const oldRook = toUndo.to[0] === 'c' ? 'a' : 'h'
      const newRook = toUndo.to[0] === 'c' ? 'd' : 'f'
      const [oldI, oldJ] = notationToIndices(oldRook + rank)
      const [newI, newJ] = notationToIndices(newRook + rank)

      this.board[newI][newJ] = null
      this.board[oldI][oldJ] = new Rook(
        toUndo.pieceMoved.color,
        oldRook + rank,
        this
      )
    }
    return true
  }
}
