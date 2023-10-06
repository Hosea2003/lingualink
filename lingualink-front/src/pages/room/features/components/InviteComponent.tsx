import React, { useContext, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import UserListItem from '../../../../components/UserListItem'
import './invite-component.css'
import useAxios from '../../../../hooks/useAxios'
import { ManageRoomContext } from '../ManageRoom'

function InviteComponent({user, invitationSent}:{user:LinguaUser, invitationSent:boolean}) {
  
    const [isInvited, setInvited]=useState(invitationSent)
    const {room}=useContext(ManageRoomContext)

    const axios = useAxios()

    async function sendInvitation(){
        await axios.post(
            '/room/invite-people/'+room.id,{
                users:[
                    user.email
                ]
            }
        )

        setInvited(true)
    }

    return (
    <div className='invite-user-component'>
        <div className="item">
            <UserListItem profile_picture={user.profile_picture}
                display_name={user.email}/>
        </div>
        {!isInvited ?(
            <button className="send-invitation inner"
                onClick={sendInvitation}>Send</button>
        ):(
            <div className="invitation-sent inner">
                <img src={require('../../../../assets/images/send_image.png')} alt="" />
                Sent
            </div>
        )}
    </div>
  )
}

export default InviteComponent