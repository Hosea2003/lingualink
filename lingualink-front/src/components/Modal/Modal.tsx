import React from 'react'
import ReactDOM from 'react-dom'
import './modal.css'

type ModalProps={
    onBackdropClick:()=>void
    children?:React.ReactNode
    title:string
}

const Modal:React.FC<ModalProps> =({onBackdropClick, children, title})=>{
  return ReactDOM.createPortal(
  <div className='modal-container'>
    <div className="modal-wrapper">
      <div className="header">
        <span className="label">{title}</span>
        <button className="close" onClick={()=>onBackdropClick()}><img src={require('../../assets/images/close grey.png')} alt="" /></button>
      </div>
      {children}
    </div>
  </div>, document.getElementById('modal-root')!)
}

export default Modal