import { useEffect, useState } from "react"
import BoardComponent from "./BoardComponent"
import Game from "../chessLogic/Game"
import "./styling/global.css"
import "./styling/AnalysisBoard.css"
import { PieceT } from "../chessLogic/pieces/Piece"
import Color from "../chessLogic/Color"
import { useLocation } from "react-router-dom"
import { MoveScore } from "../chessLogic/Engine"
import { toFEN } from "../chessLogic/fenPGN"
import { uciLineToPGN } from "../chessLogic/parser"
import loadingGif from "../assets/loading.gif"

/**
 * A Chess.com-like analysis board for seeing the engine evaluation of
 * different moves
 */
function AnalysisBoard() {
  const location = useLocation()
  let {
    fen,
    player
  } = location.state as { fen?: string, player?: Color }

  const [game, setGame] = useState(new Game(undefined, fen))
  const [lines, setLines] = useState<MoveScore[]>()
  const [loading, setLoading] = useState(false)
  const [engineWorker, setEngineWorker] = useState<Worker>()

  useEffect(() => {
    findLines()

    return destroyWorker
  }, [])

  const destroyWorker = () => {
    engineWorker?.postMessage('quit')
    engineWorker?.terminate()
  }

  const findLines = async () => {
    setLoading(true)
    return new Promise<void>((resolve, reject) => {
      const newWorker = new Worker("../chessLogic/analysisWorker")

      newWorker.onmessage = (e: MessageEvent<MoveScore[]>) => {
        setLines(e.data)
        setLoading(false)
        resolve(undefined)
      }

      newWorker.postMessage(toFEN(game))
      setEngineWorker(newWorker)
    })
  }

  player = typeof player === 'undefined' ? game.turn : player

  const playMove = (from: string, to: string, promoType?: PieceT) => {
    game.playMove(from, to, promoType)
    setGame(Object.assign(new Game(), game))
    findLines()
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
