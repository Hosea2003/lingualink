import { time } from 'console'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LinguaUser } from '../../types/user'
import UserListItem from '../../components/UserListItem'

function UserMessageItem({user}:{user:LinguaUser}) {
  
    const location =useLocation()
    const match = location.pathname==='/message/'+user.id!
  
    return (
    <NavLink className={match?"user-list-item active":"user-list-item"}
        to={user.id!.toString()}>
        <UserListItem display_name={user.email}
            profile_picture={user.profile_picture}/>
    </NavLink>
  )
}

export default UserMessageItem