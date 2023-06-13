import { useEffect, useState, useMemo } from "react"
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
import { WORKER_STATUS, useWorker } from "@koale/useworker"

const engine = new Engine(20, 3)

/**
 * Finds the best moves in the given position
 * @param fen the current board position, as a FEN
 * @returns the best moves
 */
const getMoves = async (fen: string): Promise<MoveScore[]> => {
  return await engine.getBestMoves(fen)
}

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
  const engine = useMemo(() => new Engine(20, 3), [])
  const [
    getMovesWorker, 
    { status: workerStatus, kill: workerKill }
  ] = useWorker(getMoves)

  useEffect(() => {
    findLines()

    return () => {
      engine.quit()
      workerKill()
    }
  }, [])

  const findLines = async () => {
    if (workerStatus !== WORKER_STATUS.RUNNING) {
      setLoading(true)
      // TODO : setState is always called twice in development, but we're 
      // not allowed to have multiple parallel worker instances running at 
      // the same time. This prevents us from using React.StrictMode in
      // `index.tsx`
      setLines(await getMovesWorker(toFEN(game)))
      setLoading(false)
    }
  }

  const playMove = (from: string, to: string, promoType?: PieceT) => {
    engine.stop().then(() => {
      game.playMove(from, to, promoType)
      setGame(Object.assign(new Game(), game))
      findLines()
    })
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
