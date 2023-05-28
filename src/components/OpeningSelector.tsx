import { Link } from "react-router-dom";
import "../styling/global.css"
import "./styling/OpeningSelector.css"

function OpeningSelector(props: { name: string }) {
  return (
    <div>
      <h2>{props.name}</h2>

      <div className={['flex-row', 'link-list'].join(' ')}>
        <Link to={`${props.name}/white`}>White</Link>
        <div></div>
        <Link to={`${props.name}/black`}>Black</Link>
      </div>
    </div>
  )
}

export default OpeningSelector
