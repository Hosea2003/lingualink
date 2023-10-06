import React from 'react'
import { RoomLanguage } from '../../../types/room'
import { Link, useNavigate } from 'react-router-dom'
import '../../../assets/css/language-view.css'
import { useAuth } from '../../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import { DecodedToken, SocketResponse } from '../../../types/types'
import { useSocket } from './hooks/useSocket'
import useAxios from '../../../hooks/useAxios'
import { toast } from 'react-toastify'

type LanguageViewProps={
    roomLanguage:RoomLanguage
    slug:string
}

function LanguageView(props:LanguageViewProps) {
    const language = props.roomLanguage.language
    const translator = props.roomLanguage.translator
    const {token}=useAuth()
    const userId = (jwtDecode(token!.access) as DecodedToken).user_id
    const isTranslator = userId===props.roomLanguage.translator.id
    const socket=useSocket()

    const axios = useAxios()
    const navigate = useNavigate()

    async function createRoom(){

        // if(socket.isReady){

        //     const ws = socket.ws!

        //     ws.send(JSON.stringify({
        //         type:"create-room",
        //         room:props.slug,
        //         language_code:language.code,
        //         user_id:userId
        //     }))
        // }
        const {data}=await axios.post<{room_language_id:string}>(
            '/room/start-meeting',{
                slug:props.slug,
                language_code:language.code
            }
        )

        navigate('join/'+data.room_language_id)
    }

    async function joinRoom(){
        const {data}=await axios.post<{
            room_id:string
        }>(
            "/room/join-room-language",{
                room_name:props.slug,
                language_code:props.roomLanguage.language.code
            }
        )

        if(data.room_id){
            navigate('join/'+data.room_id)
        }
        else{
            toast('The meeting has not started yet', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
    }


    
  return (
    <div className='language'>
        <div className="info">
            <span className="language-name">{language.name}</span>
            <span className="translator-info">
                <Link to={''} className='link'>translate by {translator.username} {translator.last_name}</Link>
            </span>
        </div>
        {isTranslator? (
            <button className="join-btn" onClick={createRoom}>Start</button>
        ):<>
        {
            <button className="join-btn" onClick={joinRoom}>Join</button>
        }
        </>}
    </div>
  )
}

export default LanguageView