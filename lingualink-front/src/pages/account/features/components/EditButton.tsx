import React, { ButtonHTMLAttributes} from 'react'

function EditButton(props:ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="edit" {...props}>
        Edit
        <img src={require('../assets/images/edit.png')} alt=""/>
    </button>
  )
}

export default EditButton