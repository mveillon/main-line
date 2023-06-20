import "../../components/styling/global.css"
import OpeningSelector from "../../components/OpeningSelector"

const London = () => {
  return (
    <div className="opening-list">
      <h1>London</h1>
      <OpeningSelector
        name='Standard'
        dir='london/standard'
      />
      <OpeningSelector
        name='c4'
        dir='london/c4'
      />
    </div>
  )
}

export default London