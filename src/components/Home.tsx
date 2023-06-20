import React from "react"
import "./styling/global.css"
import "./styling/Home.css"
import OpeningSelector from "./OpeningSelector"
import { Link } from "react-router-dom"
import COLOR from "../chessLogic/Color"

/**
 * The home page
 */
function Home () {
  return (
    <div className='home'>
      <h1>Main Line</h1>
      <Link to="/london">London</Link>
      <Link to="/caro-kann">Caro-Kann</Link>
      <Link to="/analysis" state={{
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        player: COLOR.WHITE
      }}>Analysis Board</Link>
    </div>
  )
}

export default Home
