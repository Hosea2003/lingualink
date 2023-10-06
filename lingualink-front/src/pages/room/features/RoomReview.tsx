import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import useAxios from '../../../hooks/useAxios'
import { Room } from '../../../types/room'
import MeetingImage from '../../../assets/images/meeting.jpg'
import LanguageView from './LanguageView'
import '../../../assets/css/room-review.css'
import { useAuth } from '../../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import { DecodedToken } from '../../../types/types'

function RoomReview({room}:{room:Room}) {

  const {token}=useAuth()
  const userId=(jwtDecode(token!.access) as DecodedToken).user_id

  return(
    <div className='room-review'>
      <h1 className="name">{room.name}</h1>
      <div className="room-body">
      <div className="description-container">
        <img src={MeetingImage} alt="" className='image'/>
        <p className="description">{room.description.replace('/n', '</br>')}</p>
       {room.host?.id===userId && (
         <Link className="manage-room-link" to={'manage'}>Manage</Link>
       )}
      </div>
      <div className="languages-info">
        <h3 className="intro">You can choose these available languages</h3>
        {room.languages?.map((language, index)=>(
          <LanguageView roomLanguage={language} key={index} slug={room.slug!}/>
        ))}
      </div>
    </div>
    </div>
  )
}

export default RoomReview