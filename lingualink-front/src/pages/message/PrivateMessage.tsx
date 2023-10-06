import React, { FormEvent, useEffect, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useParams } from 'react-router-dom'
import { Message } from '../../types/message'
import MessageComponent from '../../components/MessageComponent'
import { useAuth } from '../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import { DecodedToken, SocketResponse } from '../../types/types'
import { WS_URI } from '../../const/API'
import { LinguaUser } from '../../types/user'


type PrivateMessageType={
    sender:LinguaUser
    receiver:LinguaUser,
    content:string
}

function PrivateMessage() {

    const axios = useAxios()
    const {id}=useParams()
    const [messages, setMessages]=useState<Message[]>([])
    const {token} = useAuth()
    const userId=(jwtDecode(token!.access) as DecodedToken).user_id
    const messageRef = useRef<HTMLInputElement|null>(null)
    const [socket, setSocket]=useState<WebSocket|null>(null)

    useEffect(()=>{
        async function fetchMessages(){
            const {data}=await axios.get<Message[]>(
                '/message/get-messages/'+id
            )
            setMessages(data)
        }
        fetchMessages()
    }, [id])

    useEffect(()=>{
        const socket = new WebSocket(WS_URI+'/message?token='+token?.access)

        socket.onopen=()=>{
            socket.send(JSON.stringify({
                type:'join-room',
                other:id
            }))
        }

        setSocket(socket)

        socket.onmessage=e=>{
            const data = JSON.parse(e.data) as SocketResponse
            if(data.type==='new-message'){
                const message = (JSON.parse(e.data)as {message:PrivateMessageType}).message
                // console.log(message.receiver.id==userId && message.sender.id==id)
                if((message.receiver.id==id && message.sender.id==userId)||
                (message.receiver.id==userId && message.sender.id==id))
                    setMessages(prev=>[(JSON.parse(e.data) as {message:Message}).message, ...prev])
            }
        }
    }, [id])

    function sendMessage(event:FormEvent){
        event.preventDefault()
        if(messageRef.current && socket){
            socket.send(JSON.stringify({
                type:'send-message',
                receiver_id:id,
                content:messageRef.current.value
            }))
            messageRef.current.value=''
        }
    }

  return (
    <div className='chat-room private-message'>
      <div className="messages">
        {messages.map((m, index, arr)=>{
            const sameAs = index <messages.length-1 && m.sender.id===arr[index+1].sender.id
            return (
              <MessageComponent user={m.sender}
                key={index}
                isSender={m.sender.id===userId} content={m.content}
                afterSame={index===0?false:sameAs}/>
            )
        })}
      </div>
      <form className="send-message-form"
      onSubmit={sendMessage}
      >
        <input type="text" className="send-message-input" 
        placeholder='Your message here' ref={messageRef}/>
        <button>
          <img src={require('../../assets/images/send.png')} alt="" />
        </button>

      </form>
    </div>
  )
}

export default PrivateMessage