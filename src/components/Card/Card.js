import React from 'react'
import './Card.css'

function Card(props) {
  return (
    <div className='Card'>
      <img src={props.image} alt={props.name} id={props.id} onClick={() => props.shuffleScoreCard(props.id)}/>
    </div>
  )
}

export default Card
