import React from 'react'
import '../assets/css/custom-input.css'

export type CustomInputProps={
    onChangeText?:(value:string)=>void
    children?:any
}&React.InputHTMLAttributes<HTMLInputElement>

function CustomInput({children, onChangeText, className,  ...props}:CustomInputProps) {
  return (
    <div className={className?`custom-input ${className}`:"custom-input"}>
        <input {...props} className='input' onChange={(event)=>{
          onChangeText && onChangeText(event.target.value)
          props.onChange && props.onChange(event)
        }}/>
        {children}
    </div>
  )
}

export default CustomInput