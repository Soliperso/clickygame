import React from 'react'
import { FaCaretRight as Arrow } from "react-icons/fa";

const Score = (props) => (
  <div>
    <h3>You score is: <Arrow /><span>{props.total}</span></h3>
    <h4 style={{color: 'red'}}>{props.status}</h4>
  </div>
)

export default Score
