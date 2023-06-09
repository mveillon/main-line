import "./styling/global.css"
import "./styling/Home.css"
import OpeningSelector from "./OpeningSelector"

/**
 * The home page
 */
function Home () {
  return (
    <div className='home'>
      <h1>Main Line</h1>
      <OpeningSelector name='London' />
      <OpeningSelector name='Caro-Kann' />
    </div>
  )
}

export default Home
