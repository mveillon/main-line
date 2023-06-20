import "../../components/styling/global.css"
import OpeningSelector from "../../components/OpeningSelector"

const CaroKann = () => {
  return (
    <div className="opening-list">
      <h1>Caro-Kann</h1>
      <OpeningSelector
        name='Advance'
        dir='caro-kann/advance'
      />
      <OpeningSelector
        name='Exchange'
        dir='caro-kann/exchange'
      />
      <OpeningSelector
        name='Ignore'
        dir='caro-kann/ignore'
      />
    </div>
  )
}

export default CaroKann