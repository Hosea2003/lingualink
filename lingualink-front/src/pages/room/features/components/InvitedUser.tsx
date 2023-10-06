import React, { useContext, useEffect, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import { ManageRoomContext } from '../ManageRoom'
import useAxios from '../../../../hooks/useAxios'
import UserListItem from '../../../../components/UserListItem'
import InviteToRoom from './InviteToRoom'

function InvitedUser() {

    const [invited, setInvited]=useState<LinguaUser[]>([])
    const {room}=useContext(ManageRoomContext)
    const axios = useAxios()
    const [open, setOpen]=useState(false)

    useEffect(()=>{
        async function fetchInvitation(){
            const {data}=await axios.get<LinguaUser[]>(
                '/room/invited-users/'+room.id
            )

            setInvited(data)
        }
        fetchInvitation()
    }, [])

  return (
    <div className='white-card'>
        <h3>Invited user</h3>
        <button className="invite-btn" onClick={()=>setOpen(true)}>Invite</button>
        <div className="invited-users">
            {invited.map((i, index)=>(
                <UserListItem profile_picture={i.profile_picture} display_name={i.email}
                    key={index}/> ))}
        </div>
        <InviteToRoom isOpen={open} onBackdropClick={()=>setOpen(false) } 
        onInvited={(invited)=> console.log(invited)}/>
    </div>
  )
}

export default InvitedUser