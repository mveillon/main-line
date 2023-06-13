import { Board } from "./Board"
import COLOR from "./Color"
import { Piece, PieceT } from "./pieces/Piece"
import Bishop from "./pieces/Bishop"
import King from "./pieces/King"
import Knight from "./pieces/Knight"
import Queen from "./pieces/Queen"
import Rook from "./pieces/Rook"
import Pawn from "./pieces/Pawn"
import Game from "./Game"
import { toFEN } from "./fenPGN"

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
 * corresponds to. Acronym should be uppercase
 * @param acronym the piece acronym. If it is not a typical piece
 * acronym, it will default to Pawn
 * @returns the typeof the piece it corresponds to
 */
export const acronymToPiece = (acronym: string): PieceT => {
  const acs = acronyms()

  if (typeof acs[acronym] === 'undefined') {
    return Pawn
  }
  return acs[acronym]
}

/**
 * Returns the abbreviation associated with that piece, or an empty string for pawns
 * @param piece the piece type
 * @returns a lowercase char associated with that piece
 */
export const pieceToAcronym = (piece: PieceT): string => {
  const abbrs: { [index: string]: string } = {
    [Bishop.name]: 'b',
    [King.name]: 'k',
    [Knight.name]: 'n',
    [Pawn.name]: '',
    [Queen.name]: 'q',
    [Rook.name]: 'r'
  }

  return abbrs[piece.name]
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
 * Makes the move given by the notation. Assumes the move is legal.
 * TODO : seperate this into parseMove and algebraicToMove or algebraicToUCI
 * @param notation the move, in chess notation. If it is black's move,
 * the notation should start with "..."
 */
export const parseMove = (notation: string, board: Board) => {
  notation = trimMoveNumber(notation)

  let turn: COLOR;
  const ellipseRegex = /^\.\.\./
  if (ellipseRegex.test(notation)) {
    turn = COLOR.BLACK
    notation = notation.replace(ellipseRegex, '')
  } else {
    turn = COLOR.WHITE
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
    if (notation[lastInd] in acs) {
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

  const king = board.findPieces(King, turn)[0]
  if (notation === 'O-O') {
    board.movePiece(king.coords, 'g' + king.coords[1])
  } else if (notation === 'O-O-O') {
    board.movePiece(king.coords, 'c' + king.coords[1])
  } else {
    const pieceType = acronymToPiece(notation[0])

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
        board.movePiece(p.coords, to, promotionType)
        break
      }
    }
  }
}

/**
 * Converts a move in UCI long algebraic notation into something that can be
 * passed to Board.movePiece
 * @param uci the move notation
 * @returns `from`: where the piece moved from
 * @returns `to`: where the piece moved to
 * @returns `promoType`: what the piece promoted to, or undefined if there
 * was no promotion
 */
export const uciToMove = (uci: string): [string, string, PieceT | undefined] => {
  let promotionType: PieceT | undefined = undefined
  if (uci.length > 4) {
    const p = uci[uci.length - 1]
    promotionType = acronyms()[p.toUpperCase()]
  }
  return [
    uci.slice(0, 2),
    uci.slice(2, 4),
    promotionType
  ]
}

/**
 * Converts the UCI notation into short algebraic notation e.g. `g1f3` becomes
 * `Nf3`
 * @param uci the UCI notation
 * @param board the board to make the move on
 * @returns the same move in short algebraic notation
 */
export const uciToAlgebraic = (uci: string, board: Board): string => {
  const [from, to, promoType] = uciToMove(uci)
  
  const piece = board.pieceAt(from)
  if (piece === null) {
    throw new Error(`${from} is an empty square`)
  }

  let parts: string[] = []

  const castling = (
    piece instanceof King &&
    from[0] === 'e' &&
    (to[0] === 'c' || to[0] === 'g')
  )
  if (castling) {
    parts.push('O-O')
    if (to[0] === 'c') {
      parts.push('-O')
    }
  } else {
    parts.push(pieceToAcronym(piece.type).toUpperCase())
    if (piece instanceof Pawn && from[0] !== to[0]) {
      parts.push(from[0])
    } else {
      const otherPieces = board.findPieces(piece.type, piece.color)
      for (const p of otherPieces) {
        if (p.coords !== piece.coords && p.legalMoves().has(to)) {
          if (p.coords[0] === piece.coords[0]) {
            parts.push(piece.coords[1])
          } else {
            parts.push(piece.coords[0])
          }
  
          break
        }
      }
    }
  
    if (board.pieceAt(to) !== null) {
      parts.push('x')
    }
  
    parts.push(to)
  
    if (piece instanceof Pawn && (to[1] === '1' || to[1] === '8')) {
      if (typeof promoType === 'undefined') {
        throw new Error(`Undefined promotion type moving ${from} to ${to}`)
      }
  
      parts.push(`=${pieceToAcronym(promoType).toUpperCase()}`)
    }
  }

  board.movePiece(from, to, promoType)
  if (board.isInCheck(+!piece.color)) {
    if (board.canMove(+!piece.color)) {
      parts.push('+')
    } else {
      parts.push('#')
    }
  }
  board.undoLastMove()

  return parts.join('')
}

/**
 * Converts a list of UCI moves to a single PGN
 * @param line the moves to make
 * @param game the game to play them in
 * @returns the PGN
 */
export const uciLineToPGN = (line: string[], game: Game): string => {
  let moveNo = game.moveNumber
  const lineParts: string[] = []
  let formattedMove: string[] = [`${moveNo}. `]
  let turn = game.turn
  if (turn === COLOR.BLACK) {
    formattedMove.push('...')
  }

  const gameCopy = new Game(undefined, toFEN(game))

  for (const move of line) {
    formattedMove.push(uciToAlgebraic(move, gameCopy.board) + ' ')
    gameCopy.board.movePiece(...uciToMove(move))

    if (formattedMove.length === 3) {
      lineParts.push(formattedMove.join(''))
      formattedMove = [`${++moveNo}. `]
    }
  }
  if (formattedMove.length > 1) {
    lineParts.push(formattedMove.join(''))
  }


  return lineParts.join('')
}

