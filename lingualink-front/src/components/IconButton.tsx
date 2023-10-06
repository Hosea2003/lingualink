import React from 'react'
import '../assets/css/icon-button.css'

type IconButtonProps={
    icon:string
}&React.ButtonHTMLAttributes<HTMLButtonElement>

function IconButton({icon, ...props}:IconButtonProps) {
  return (
    <button {...props} className='icon-button'>
        <img src={icon} alt="" />
        {props.children}
    </button>
  )
}

export default IconButton