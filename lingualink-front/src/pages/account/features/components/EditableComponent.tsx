import React from 'react'
import '../assets/css/editable.css'

type EditableComponentProps={
    editable?:boolean
    onChangeText?:(text:string)=>void
}&React.InputHTMLAttributes<HTMLInputElement>

function EditableComponent({editable, onChangeText, ...props}:EditableComponentProps) {
  return (
    <input className={!editable?"editable-component":"editable-component editable"} 
    onChange={(event)=>{
        onChangeText && onChangeText(event.target.value)
    }} {...props} disabled={!editable}/>
  )
}

export default EditableComponent