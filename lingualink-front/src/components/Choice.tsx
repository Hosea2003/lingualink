import React from 'react'
import '../assets/css/choice.css'

export type ChoiceProps={
    text:string
    onSelect?:(index:number, value:string)=>void
    index?:number
    selectedIndex?:number
    value:string
}

function Choice(props:ChoiceProps) {
  return (
    <div className={`choice ${props.selectedIndex===props.index && 'selected'}`}
        onClick={()=>{props.onSelect && props.onSelect(props.index!, props.value)}}
    >{props.text}</div>
  )
}

export default Choice