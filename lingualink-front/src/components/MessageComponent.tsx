import React from 'react'
import { LinguaUser } from '../types/user'
import '../assets/css/message.css'
import { API_URI } from '../const/API'

type MessageComponentProps={
    content:string
    user:LinguaUser
    isSender:boolean
    afterSame:boolean
}

function MessageComponent({user, ...props}:MessageComponentProps) {

  function className(){
    let className='message-component'
    if(props.isSender)className+=" sender"
    return className
  }

  return (
    <div className={className()}>
        {
          !props.isSender && (
            <div className="image-container">
            {
              !props.afterSame && (
                <img src={user.profile_picture?
                  API_URI+user.profile_picture:require('../assets/images/avatar.jpg')} alt="" 
                  className='profile-picture'/>
              )
            }
            </div>
          )
        }
        <span className="message">
          {props.content}
        </span>
    </div>
  )
}

export default MessageComponent