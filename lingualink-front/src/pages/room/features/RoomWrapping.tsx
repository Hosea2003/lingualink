import React, { useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import useAxios from '../../../hooks/useAxios'
import { Room } from '../../../types/room'
import { ClipLoader } from 'react-spinners'
import RoomReview from './RoomReview'
import ManageRoom from './ManageRoom'
import RoomInteraction from './RoomInteraction'


function RoomWrapping() {

  const {slug}=useParams()

  const axios=useAxios()

  const [room, setRoom]=useState<Room|null>(null)
  const [loading, setLoading]=useState(true)

  useEffect(()=>{
  axios.get<Room>('/room/view-room/'+slug).then(response=>{
    setRoom(response.data)
    setLoading(false)
    console.log(response.data.scheduled)
  })
}, [])

  return (
    <div>
      {loading || !room?(
        <ClipLoader
          loading={loading}
          color='#0367c5'/>
      ):(
        <Routes>
        <Route path='join/:room_id' element={<RoomInteraction/>}/>
          <Route path='' element={<RoomReview room={room}/>}/>
          <Route path='manage' element={<ManageRoom room={room}/>}/>
        </Routes>
      )}
    </div>
  )
}

export default RoomWrapping