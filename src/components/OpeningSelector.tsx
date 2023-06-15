import React from "react";
import { Link } from "react-router-dom";
import "./styling/global.css"
import "./styling/OpeningSelector.css"

/**
 * One element in the list of all openings the player can choose to practice
 * @param name the name of the opening
 * @returns 
 */
function OpeningSelector(props: { name: string }) {
  return (
    <div>
      <h2>{props.name}</h2>

      <div className={['flex-row', 'link-list'].join(' ')}>
        <Link to={`${props.name}/white`}>White</Link>
        <Link to={`${props.name}/black`}>Black</Link>
      </div>
    </div>
  )
}

export default OpeningSelector
