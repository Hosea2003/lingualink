import React, { useState } from 'react'
import EditButton from './EditButton'
import '../../../../assets/css/action-buttons.css'

type ActionButtonsProps={
    onSaveClick?:()=>void
    onEditClick?:()=>void
    isEdit?:boolean
    onCancelClick?:()=>void
}

function ActionButtons({isEdit, ...props}:ActionButtonsProps) {
  return (
    <div className='action-buttons'>
        {!isEdit?(
            <EditButton onClick={()=>{
                props.onEditClick && props.onEditClick()
            }}/>
        ):(
            <>
                {/* save button */}
                <button className="save" onClick={()=>{
                    props.onSaveClick && props.onSaveClick()
                }}>
                    Save
                    <img src={require('../assets/images/save.png')} alt="" />
                </button>
                <button className="cancel" onClick={()=>{
                    props.onCancelClick && props.onCancelClick()
                }}>
                    Cancel
                    <img src={require('../assets/images/cancel.png')} alt="" />
                </button>
            </>
        )}
    </div>
  )
}

export default ActionButtons