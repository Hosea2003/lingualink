import React from 'react'
import { LinguaUser } from '../../../../types/user'
import UserListItem from '../../../../components/UserListItem'
import { API_URI } from '../../../../const/API'
import avatar from '../../../../assets/images/avatar.jpg'
import { useNavigate } from 'react-router-dom'

type ParticipantsProps={
    participants:LinguaUser[]
}

function Participants(props:ParticipantsProps) {
    const navigate=useNavigate()
  return (
    <div className='participants'>
        <div className="header">
            <h4>Participant</h4>
            <span>({props.participants.length})</span>
        </div>
        <div className="participant-list">
            {props.participants.map((participant, index)=>(
                <UserListItem display_name={participant.username}
                profile_picture={participant.profile_picture} key={index}
                onClick={()=>navigate('/message/'+participant.id)}/>
            ))}
        </div>
    </div>
  )
}

export default Participants