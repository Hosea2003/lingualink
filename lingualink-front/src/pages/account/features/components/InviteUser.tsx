import React, { useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import { API_URI } from '../../../../const/API'
import useAxios from '../../../../hooks/useAxios'

function InviteUser({user, organizationId}:{user:LinguaUser, organizationId:number}) {
    const [sent, setSent]=useState(false)
    const src = user.profile_picture?API_URI+user.profile_picture:
        require('../../../../assets/images/avatar.jpg')

    const axios=useAxios()

    async function sendInvitation(){
       await axios.post(
            '/organization/'+organizationId+'/invite-people',{
                users:[
                    user.id!
                ]
            }
        )

        setSent(true)
    }

  return (
    <div className='invite-user'>
        <img src={src} alt="" />
        <span className="display">{user.email}</span>
        <button className="send-invitation" disabled={sent}
            onClick={()=>sendInvitation()}>{sent?"Sent":"Send"}</button>
    </div>
  )
}

export default InviteUser