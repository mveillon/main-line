import { Board } from "./Board"
import Game from "./Game"
import { indicesToNotation } from "./notationIndices"
import { acronymToPiece, pieceToAcronym, doubleMove } from "./parser"
import Color from "./Color"
import King from "./pieces/King"
import { MoveInfo } from "./MoveInfo"
import Pawn from "./pieces/Pawn"
import Rook from "./pieces/Rook"

/**
 * Initializes a board from a PGN
 * @param pgn the PGN to use
 * @param board the board to initialize
 */
export const fromPGN = (pgn: string, board: Board) => {
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
    doubleMove(moves[i].trim(), board)
  }
}

/**
 * Initializes a game from a FEN
 * @param fen the FEN to use 
 * @param game the game to initialize
 */
export const fromFEN = (fen: string, game: Game) => {
  const [
    layout,
    turn,
    castlingRights,
    passantTarget,
    halfMoves,
    fullMoves
  ] = fenToParts(fen)

  const boardInd = (n: number): number => game.board.board.length - 1 - n

  const ranks = layout.split('/')
  for (let i = 0; i < ranks.length; i++) {
    const rankInd = boardInd(i)
    let j = 0
    for (const square of ranks[i]) {
      const numSkip = parseInt(square)
      if (isNaN(numSkip)) {
        const pieceType = acronymToPiece(square.toUpperCase())
        const p = new pieceType(
          square.toUpperCase() === square ? Color.White : Color.Black,
          indicesToNotation(rankInd, boardInd(j)),
          game.board
        )
        game.board.board[rankInd][boardInd(j++)] = p 
        const startRank = p.color === Color.White ? '2' : '7'
        if (p instanceof Pawn && p.coords[1] !== startRank) {
          p.hasMoved = false
        }
      } else {
        for (let k = 0; k < numSkip; k++) {
          game.board.board[rankInd][boardInd(j++)] = null
        }
      }
    }
  }

  game.turn = turn === 'w' ? Color.White : Color.Black
  if (castlingRights === '-') {
    game.board.findPieces(King, Color.White)[0].hasMoved = true
    game.board.findPieces(King, Color.Black)[0].hasMoved = true
  } else {
    const sides: { [index: string]: string } = {
      k: 'h8', q: 'a8', K: 'h1', Q: 'a1'
    }
    for (const side in sides) {
      if (!castlingRights.includes(side)) {
        const rook = game.board.pieceAt(sides[side])
        if (rook !== null) {
          rook.hasMoved = true
        }
      }
    }
  }

  if (passantTarget !== '-') {
    const oldRank = passantTarget[1] === '3' ? '2' : '7'
    const newRank = passantTarget[1] === '3' ? '4' : '5'
    const pawn = game.board.pieceAt(passantTarget[0] + newRank)
    if (pawn === null) {
      throw new Error(`No pawn can be en passanted at ${passantTarget[0] + newRank}`)
    }

    const toPush: MoveInfo = {
      from: passantTarget[0] + oldRank,
      to: passantTarget[0] + newRank,
      captured: null,
      hadMoved: false,
      enPassant: false,
      pieceMoved: pawn
    }

    game.board.movesMade.push(toPush)
    game.board.movePointer++
  }

  game.halfMoves = parseInt(halfMoves)
  game.moveNumber = parseInt(fullMoves)
}

/**
 * Generates a FEN string to describe the board
 * @returns a single line of text that describes the entire position
 */
export const toFEN = (game: Game): string => {
  const allRows: string[] = []
  for (let i = game.board.board.length - 1; i >= 0; i--) {
    const row: string[] = []
    let emptySpaces = 0
    for (let j = game.board.board[i].length - 1; j >= 0; j--) {
      const square = game.board.board[i][j]
      if (square === null) {
        emptySpaces++
        if (j === 0) {
          row.push(emptySpaces.toString())
        }
      } else {
        if (emptySpaces > 0) {
          row.push(emptySpaces.toString())
          emptySpaces = 0
        }
        let a = pieceToAcronym(square.type)
        if (square instanceof Pawn) {
          a = 'p'
        }
        if (square.color === Color.Black) {
          row.push(a)
        } else {
          row.push(a.toUpperCase())
        }
      }
    }
    allRows.push(row.join(''))
  }

  const parts = [allRows.join('/')]
  parts.push(game.turn === Color.White ? 'w' : 'b')

  const castling: string[] = []
  for (const c of [Color.White, Color.Black]) {
    const king = game.board.findPieces(King, c)[0]
    if (!king.hasMoved) {
      const rookFiles = [
        {
          file: 'h',
          meaning: 'k'
        },
        {
          file: 'a',
          meaning: 'q'
        }
      ]
      for (const rook of rookFiles) {
        const r = game.board.pieceAt(rook.file + king.coords[1])
        if (r instanceof Rook && r.color === c && !r.hasMoved) {
          castling.push(
            c === Color.White ? rook.meaning.toUpperCase() : rook.meaning
          )
        }
      }
    }
  }
  if (castling.length > 0) {
    parts.push(castling.join(''))
  } else {
    parts.push('-')
  }

  if (game.board.movePointer < 0) {
    parts.push('-')
  } else {
    const lastMove = game.board.lastMove
    const ranks = [parseInt(lastMove.from[1]), parseInt(lastMove.to[1])]
    const isTarget = (
      lastMove.pieceMoved instanceof Pawn &&
      !lastMove.hadMoved &&
      Math.abs(ranks[0] - ranks[1]) === 2
    )
    if (isTarget) {
      parts.push(
        lastMove.to[0] +
        (Math.round(ranks[0] + ranks[1]) / 2).toString()
      )
    } else {
      parts.push('-')
    }
  }

  parts.push(game.halfMoves.toString())
  parts.push(game.moveNumber.toString())

  return parts.join(' ')
}

/**
 * Splits the FEN into all relevant parts
 * @param fen the fen to split
 * @returns the piece layout
 * @returns whose turn it is
 * @returns castling rights
 * @returns en passant target
 * @returns half moves since last pawn move or capture
 * @returns number of full moves in the game
 */
export const fenToParts = (fen: string): [
  string, 
  string, 
  string, 
  string, 
  string, 
  string
] => {
  const parts = fen.split(' ')
  if (parts.length !== 6) {
    throw new Error(`Invalid FEN: ${fen}`)
  }
  return (parts as [string, string, string, string, string, string])
}
