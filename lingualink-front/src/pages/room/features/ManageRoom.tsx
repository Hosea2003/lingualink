import React, { createContext, useEffect, useState } from 'react'
import { Room } from '../../../types/room'
import { useParams } from 'react-router-dom'
import ChangeBasicInfo from './components/ChangeBasicInfo'
import '../../../assets/css/manage-room.css'
import ManageLanguages from './components/ManageLanguages'
import InvitedUser from './components/InvitedUser'

export const ManageRoomContext=createContext<{room:Room}>({
    room:{
        name: '',
        description: '',
        type_of: '',
        scheduled: ''
    }
})

function ManageRoom({room}:{room:Room}) {

  return (
    <div className='manage-room'>
        <ManageRoomContext.Provider value={{room}}>
            <ChangeBasicInfo/>
            <ManageLanguages/>
            <InvitedUser/>
        </ManageRoomContext.Provider>
    </div>
  )
}

export default ManageRoom