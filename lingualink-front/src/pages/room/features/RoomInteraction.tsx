import React, { useEffect, useState } from 'react'
import { useSocket } from './hooks/useSocket'
import { useParams } from 'react-router-dom'
import { DecodedToken, SocketResponse } from '../../../types/types'
import { LinguaUser } from '../../../types/user'
import AudioComponent from './components/AudioComponent'
import Chat from './components/Chat'
import Participants from './components/Participants'
import '../../../assets/css/room-interaction.css'
import Peer from 'peerjs'
import { v4 as uuid4 } from 'uuid'
import useAxios from '../../../hooks/useAxios'
import jwtDecode from 'jwt-decode'
import {useAuth} from '../../../hooks/useAuth'

function RoomInteraction() {

    const {room_id}=useParams()

    const {message, sendData, ws, isReady} = useSocket()

    const [participants, setParticipants]=useState<LinguaUser[]>([])
    
    const [me, setMe]=useState<Peer>()
    const axios =useAxios()
    const {token}=useAuth()
    const userId = (jwtDecode(token!.access) as DecodedToken).user_id
    
    const [stream, setStream]=useState<MediaStream>()
    const [translatorStream, setTranslatorStream]=useState<MediaStream>()

    useEffect(()=>{

        async function action(){
            if(ws){
                // get translator
                

                const {data}=await axios.get<LinguaUser>(
                    '/room/get-translator/'+room_id
                )
    

                const meId=uuid4()
                const peer=new Peer(meId)
                setMe(peer)

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setStream(stream);
                    if (data.id === userId) {
                      setTranslatorStream(stream);
                    }
                  } catch (error) {
                    console.error('Error accessing user media:', error);
                  }
            

                let peerId:string|null = peer.id
    
                if(data.id!==userId){
                    peerId=null
                }

                
                peer.on('open', (id)=>{
                    console.log('ato')
                    sendData(JSON.stringify({
                        type:"join-room",
                        room_id:room_id,
                        peer_id:peerId
                    }))
                })

            }
        }
        action()
    }, [isReady])

    useEffect(()=>{
        if(message){

            
            if(!me || !stream)return

            const data=JSON.parse(message.data) as SocketResponse
            if(data.type=="new-participant"){
                const user =(JSON.parse(message.data) as {user:LinguaUser}).user
                setParticipants(prev=>{
                    const new_user=prev.filter(p=>p.id===user.id)[0]
                    if(!new_user){
                        return [...prev, user]
                    }
                    return prev
                })
            }

            if(data.type=="existing-participants"){
                const fetched_participant = (JSON.parse(message.data) as {users:LinguaUser[], translator_peer:string})
                const users=fetched_participant.users
                setParticipants(users)
                
                if(fetched_participant.translator_peer===me.id){
                    // const call = me.call(fetched_participant.translator_peer, stream)
                    // call.on("stream", (peerStream)=>{
                    //     setTranslatorStream(peerStream)
                    // })
                    me.on('call', (call)=>{
                        call.answer(stream)
                    })
                }
                else{
                    const call = me.call(fetched_participant.translator_peer, stream)
                    call.on('stream', (peerStream)=>{
                        setTranslatorStream(peerStream)
                    })
                }
            }

            if(data.type==='room-created'){
                console.log('created')
            }

            // me.on("call", (call)=>{
            //     call.answer(translatorStream)
            // })
        }
    }, [message, me, stream])

  return (
    <div className='room-interaction'>
        <Chat/>
        <AudioComponent stream={translatorStream}/>
        <Participants participants={participants}/>
    </div>
  )
}

export default RoomInteraction