import React, { FormEvent, useState } from 'react'
import LinguaImage from '../../../assets/images/login.jpg'
import CustomInput from '../../../components/CustomInput'
import '../../../assets/css/join-room.css'
import useAxios from '../../../hooks/useAxios'
import { BasicResponse } from '../../../types/types'
import { useNavigate } from 'react-router-dom'

function JoinRoom() {

    const axios = useAxios()

    const [roomSlug, setRoomSlug]=useState("")
    const [error, setError]=useState<string|null>(null)
    const navigate=useNavigate()

    async function joinRoom(event:FormEvent){
        event.preventDefault()
        try{
            const {data}=await axios.post<BasicResponse>(
                "/room/join-room",{
                    slug:roomSlug
                }
            )

            if(data.status==="unvailable"){
                setError(data.message)
            }
            else{
                navigate("/room/"+roomSlug)
            }
            
        }
        catch{
            setError("Room not found with the provided ID")
        }
    }

  return (
    <div className='join-room'>
        <form className="join-room-form" onSubmit={joinRoom}>
            <img src={LinguaImage} alt="" />
            <h3 className="title">Join a meeting</h3>
            {error && <span className='span-error'>{error}</span>}
            <CustomInput placeholder='Your room ID' onChangeText={(value)=>setRoomSlug(value)}/>
            <button className='join-btn'>Join</button>
        </form>
    </div>
  )
}

export default JoinRoom