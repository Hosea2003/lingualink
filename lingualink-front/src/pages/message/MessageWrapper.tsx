import React from 'react'
import UserList from './UserList'
import { Route, Routes } from 'react-router-dom'
import PrivateMessage from './PrivateMessage'
import Profil from './Profil'
import './message.css'

function MessageWrapper() {
  return (
    <div className='messages-wrapper'>
        <UserList/>
        <Routes>
            <Route path=':id' element={
                <div className='user-message'>
                    <PrivateMessage/>
                    <Profil/>
                </div>
            }/>
        </Routes>
    </div>
  )
}

export default MessageWrapper