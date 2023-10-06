import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RoomReview from './features/RoomReview'
import JoinRoom from './features/JoinRoom'
import RoomHome from './features/RoomHome'
import CreateRoom from './features/CreateRoom'
import CreaterRoomWrapper from './features/CreaterRoomWrapper'
import SocketProvider from './features/hooks/useSocket'
import RoomInteraction from './features/RoomInteraction'
import ManageRoom from './features/ManageRoom'
import RoomWrapping from './features/RoomWrapping'

function Room() {
  return (
    <div className="room-page-wrapper">
      <SocketProvider>
        <Routes>
          <Route path='' element={<RoomHome/>}/>
          <Route path=':slug/*' element={<RoomWrapping/>}/>
          <Route path='join' element={<JoinRoom/>}/>
          <Route path='create' element={<CreaterRoomWrapper/>}/>
        </Routes>
    </SocketProvider>
    </div>
  )
}

export default Room