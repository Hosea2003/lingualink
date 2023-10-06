import React from 'react'
import { Room } from '../../../../types/room'
import { Link } from 'react-router-dom'

function CreatedRoomComponent({room}:{room:Room}) {
  return (
    <div className='created-room'>
        <span>{room.name}</span>
        <Link className="manage" to={room.slug!}>View</Link>
    </div>
  )
}

export default CreatedRoomComponent