import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Message } from '../../../../types/message'
import MessageComponent from '../../../../components/MessageComponent'
import { useAuth } from '../../../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import { DecodedToken, SocketResponse } from '../../../../types/types'
import useAxios from '../../../../hooks/useAxios'
import { useSocket } from '../hooks/useSocket'
import { LinguaUser } from '../../../../types/user'
import { useParams } from 'react-router-dom'

function Chat() {

  const messageRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages]=useState<Message[]>([])
  const {token}=useAuth()
  const userId = (jwtDecode(token!.access) as DecodedToken).user_id
  const axios=useAxios()
  const {room_id}=useParams()
  const {message}=useSocket()

  useEffect(()=>{
    async function fetchMessage(){
      const {data} = await axios.get<Message[]>(
        "/room/get-room-messages/"+room_id
      )
      setMessages(data)
    }
    fetchMessage()
  }, [])

  useEffect(() => {
    if(message) {
      const type = (JSON.parse(message.data) as SocketResponse).type;
      if (type === 'new-message') {
        const incomingMessage = (JSON.parse(message.data) as {message:Message}).message ;
        // Update the messages state with the new message
        setMessages((prevMessages) => [incomingMessage, ...prevMessages ]);
      }

    };
  }, [message]);

  async function sendMessage(event:FormEvent){
    event.preventDefault()
    if(messageRef.current){

        await axios.post(
          "/room/send-room-message/"+room_id,{
            content:messageRef.current.value
          }
        )

        
        messageRef.current.value=""
    
    }
  }

  return (
    <div className='chat-room'>
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
      onSubmit={sendMessage}>
        <input type="text" className="send-message-input" 
        placeholder='Your message here' ref={messageRef}/>
        <button>
          <img src={require('../../../../assets/images/send.png')} alt="" />
        </button>

      </form>
    </div>
  )
}

export default Chat