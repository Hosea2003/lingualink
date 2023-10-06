import React from 'react'
import Modal from './Modal'

type BaseModalWrapperProps={
    onBackdropClick:()=>void
    isOpen:boolean
}

function BaseModalWrapper({isOpen, onBackdropClick}:BaseModalWrapperProps) {

    if(!isOpen)return null

  return (
    <Modal onBackdropClick={onBackdropClick} title='Test'>
      <span>rindra</span>
    </Modal>
  )
}

export default BaseModalWrapper