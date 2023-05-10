import { Board } from "./Board"
import Color from "./Color"
import { Piece, PieceT } from "./pieces/Piece"
import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import Pawn from "./pieces/Pawn"

/**
 * Returns the acronyms used for pieces in chess notation
 * @returns all piece acronyms
 */
const acronyms = (): { [index: string]: PieceT } => {
  return {
    'B': Bishop,
    'K': King,
    'N': Knight,
    'Q': Queen,
    'R': Rook
  }
}

/**
 * Gets rid of any potential "1. " or "15. " substrings
 * that start the notation
 * @param notation the original notation
 * @returns the trimmed notation with just the moves
 */
const trimMoveNumber = (notation: string): string => {
  const r = /^[0-9]+\./ // matches the turn number e.g. 4.
  const s = /\s{2,}/ // matches double (or more) whitespace
  return notation.replace(r, '').replace(s, ' ').trim()
}

/**
 * Converts the piece acronym (e.g. B or N) to the piece it 
 * corresponds to
 * @param acronym the piece acronym. If it is not a typical piece
 * acronym, it will default to Pawn
 * @returns the typeof the piece it corresponds to
 */
const pieceAcronym = (acronym: string): PieceT => {
  const acs = acronyms()

  if (typeof acs[acronym] === 'undefined') {
    return Pawn
  }
  return acs[acronym]
}

/**
 * Castles for whoever's turn it is. Moves the king to the new `kingFile`
 * and whichever rook is on `oldRookFile` to `newRookFile`
 * @param kingFile which file should the king move to
 * @param oldRookFile which file the rook should currently be on
 * @param newRookFile which file should the rook move to
 * @param board the current board
 */
const castle = (
  turn: Color,
  kingFile: string, 
  oldRookFile: string, 
  newRookFile: string, 
  board: Board) => {

  const king = board.findPieces(King, turn)[0]
  const allRooks = board.findPieces(Rook, turn, oldRookFile)
  if (allRooks.length === 0) {
    throw new Error(`There is no rook on the correct square!`)
  }
  
  const rank = turn === Color.White ? '1' : '8'
  board.movePiece(king.coords, kingFile + rank)
  board.movePiece(allRooks[0].coords, newRookFile + rank, false)
}

/**
 * Performs both moves of a PGN line such as 1. e4 e5
 * @param moveNotation the two moves to perform
 * @param board the board to perform the moves on
 */
export const doubleMove = (moveNotation: string, board: Board) => {
  moveNotation = trimMoveNumber(moveNotation)

  const moves = moveNotation.split(' ')
  parseMove(moves[0], board)
  if (moves.length > 1) {
    parseMove('...' + moves[1], board)
  }
}

/**
 * Makes the move given by the notation. Assumes the move is legal
 * @param notation the move, in chess notation. If it is black's move,
 * the notation should start with "..."
 */
export const parseMove = (notation: string, board: Board) => {
  notation = trimMoveNumber(notation)

  let turn: Color;
  const ellipseRegex = /^\.\.\./
  if (ellipseRegex.test(notation)) {
    turn = Color.Black
    notation = notation.replace(ellipseRegex, '')
  } else {
    turn = Color.White
  }

  const acs = acronyms()
  let promotionType: PieceT | undefined = undefined
  let lastInd = notation.length - 1
  while (
    lastInd >= 0 && 
    isNaN(parseInt(notation[lastInd])) && 
    notation[lastInd] !== 'O'
  ) {
    // handles promotion, checks, checkmate, and decorations
    if (typeof acs[notation[lastInd]] !== "undefined") {
      promotionType = acs[notation[lastInd]]
    }

    lastInd--
  }
  if (lastInd < 0) {
    throw new Error(`Invalid move ${notation}`)
  }
  
  if (lastInd < notation.length - 1) {
    notation = notation.slice(0, lastInd + 1)
  }

  if (notation === 'O-O') {
    castle(turn, 'g', 'h', 'f', board)
  } else if (notation === 'O-O-O') {
    castle(turn, 'c', 'a', 'd', board)
  } else {
    const pieceType = pieceAcronym(notation[0])

    let pieces: Piece[];
    if (notation.length === 2) {
      // normal pawn move
      pieces = board.findPieces(pieceType, turn, notation[0])

    } else if (notation.length === 3) {
      // normal piece move
      pieces = board.findPieces(pieceType, turn)
      
    } else {
      if (pieceType === Pawn) {
        // pawn capture
        pieces = board.findPieces(
          pieceType, 
          turn,
          notation[0]
        )
      } else if (notation[1] === 'x') {
        // piece capture
        pieces = board.findPieces(pieceType, turn)
      } else {
        // two pieces can move to same square
        if (isNaN(parseInt(notation[1]))) {
          // sort by file
          pieces = board.findPieces(
            pieceType, 
            turn,
            notation[1]
          )
        } else {
          // sort by rank
          pieces = board.findPieces(
            pieceType,
            turn,
            undefined,
            notation[1]
          )
        }
      }
    }

    const to = notation.slice(notation.length - 2)
    for (const p of pieces) {
      if (p.legalMoves().has(to)) {
        board.movePiece(p.coords, to, true, promotionType)
      }
    }
  }
}

/**
 * Converts a move in UCI long algebraic notation into something that can be
 * passed to Board.movePiece
 * @param uci the move notation
 * @returns where the piece moved from, where the piece moved to, and the 
 * initial of the piece type promoted to, or undefined if there was no
 * promotion
 */
export const uciToMove = (uci: string): [string, string, string | undefined] => {
  let promotionType = undefined
  if (uci.length > 4) {
    promotionType = uci[uci.length - 1]
  }
  return [
    uci.slice(0, 2),
    uci.slice(2, 4),
    promotionType
  ]
}

