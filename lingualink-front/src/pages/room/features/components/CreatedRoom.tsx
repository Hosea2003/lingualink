import React, { useEffect, useState } from 'react'
import { Room } from '../../../../types/room'
import useAxios from '../../../../hooks/useAxios'
import CreatedRoomComponent from './CreatedRoomComponent'
import '../../../../assets/css/created-room.css'

function CreatedRoom() {

    const [rooms, setRooms]=useState<Room[]>([])
    const axios = useAxios()

    useEffect(()=>{
        async function fetchRoom(){
            const {data}=await axios.get<Room[]>(
                '/room/created-rooms'
            )
            setRooms(data)
        }
        fetchRoom()
    }, [])

  return (
    <div className='created-rooms'>
        <h4>Created room</h4>
        {rooms.map((room, index)=>(
            <CreatedRoomComponent room={room} key={index}/>
        ))}
    </div>
  )
}

export default CreatedRoom