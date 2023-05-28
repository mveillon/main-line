import "./styling/global.css"
import "./styling/home.css"
import OpeningSelector from "./components/OpeningSelector"

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
