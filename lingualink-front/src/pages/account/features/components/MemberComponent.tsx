import React from 'react'
import { LinguaUser } from '../../../../types/user'
import { API_URI } from '../../../../const/API'

function MemberComponent({user}:{user:LinguaUser}) {

    const src = user.profile_picture?API_URI+user.profile_picture:
        require('../../../../assets/images/avatar.jpg')

  return (
    <div className='invite-user'>
        <img src={src} alt="" />
        <span className="display">{user.email}</span>
    </div>
  )
}

export default MemberComponent