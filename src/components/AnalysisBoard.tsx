import React, { useMemo } from "react"
import { useEffect, useState } from "react"
import BoardComponent from "./BoardComponent"
import Game from "../chessLogic/Game"
import "./styling/global.css"
import "./styling/AnalysisBoard.css"
import { PieceT } from "../chessLogic/pieces/Piece"
import { useLocation } from "react-router-dom"
import { Engine, MoveScore } from "../chessLogic/Engine"
import { uciLineToPGN } from "../chessLogic/parser"
import loadingGif from "../assets/loading.gif"
import COLOR from "../chessLogic/Color"
import { toFEN } from "../chessLogic/fenPGN"

/**
 * A Chess.com-like analysis board for seeing the engine evaluation of
 * different moves
 */
function AnalysisBoard() {
  const location = useLocation()
  const {
    fen,
    player
  } = location.state as { fen: string, player: COLOR }

  const [game, setGame] = useState(new Game(undefined, fen))
  const [lines, setLines] = useState<MoveScore[]>()
  const [loading, setLoading] = useState(false)
  const engine = useMemo(() => (new Engine(20, 3)), [])

  useEffect(() => {
    findLines(game)

    return () => {
      engine.quit()
    }
  }, [])

  const findLines = async (currentGame: Game) => {
    setLoading(true)
    setLines(await engine.getBestMoves(toFEN(currentGame)))
    setLoading(false)
  }

  const playMove = (from: string, to: string, promoType?: PieceT) => {
    game.playMove(from, to, promoType)
    setGame(Object.assign(new Game(), game))
    findLines(game)
  }

  return (
    <div>
      <h1>Analysis Board</h1>

      <BoardComponent
        game={game}
        playMove={playMove}
        perspective={player}
        canMove={true}
      />

      {
        loading &&
        <img src={loadingGif} className='loading-gif' alt='loading' />
      }

      {
        !loading &&
        lines?.map((line) => {
          const uci = uciLineToPGN(
            [line.move, ...line.line.slice(0, 4)],
            game
          )
          const score = (line.score / 100).toLocaleString(
            'en-us',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )
          const s = `${score}: ${uci}`
          return <p key={line.move}>{s}</p>
        })
      }
    </div>
  )
} 

export default AnalysisBoard
