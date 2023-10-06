import React from 'react'
import '../assets/css/user-item.css'
import { API_URI } from '../const/API'

export type UserListItemProps={
    profile_picture?:string
    display_name:string
    onClick?:()=>void
}

function UserListItem(props:UserListItemProps) {
  return (
    <div className='user-item' onClick={props.onClick}>
        <img src={props.profile_picture?API_URI+props.profile_picture:require("../assets/images/avatar.jpg")} alt="" className='user-image'/>
        <span className="user-display-name">{props.display_name}</span>
    </div>
  )
}

export default UserListItem