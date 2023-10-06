import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import { Message } from '../../../../types/message'
import { useAuth } from '../../../../hooks/useAuth'
import { RoomSocket } from '../../../../types/room'
import { SocketResponse } from '../../../../types/types'
import { useNavigate } from 'react-router-dom'
import { WS_URI } from '../../../../const/API'

type SocketContextProps={
    ws:WebSocket |null,
    isReady:boolean,
    sendData:(data:string)=>void,
    message:MessageEvent|undefined
}

const SocketContext = createContext<SocketContextProps>({
    ws:null,
    isReady:false,
    message:undefined,
    sendData:()=>{}
})

function SocketProvider({children}:{children:React.ReactNode}) {
    
    const [ws, setSocket]=useState<WebSocket|null>(null)
    const {token} = useAuth()
    const [isReady, setReady]=useState(false)
    const [message, setMessage]=useState<MessageEvent>()
    const navigate = useNavigate()

    useEffect(()=>{

        function startSocket(){
            const socket = new WebSocket(WS_URI+"/room?token="+token?.access)
            setSocket(socket)
            socket.onopen = ()=>{
                setReady(true);
            }
            socket.onclose = ()=>{
                setSocket(null)
                setTimeout(startSocket, 5000)
            }

            return socket
        }
        // const socket = new WebSocket(WS_URI+"/room?token="+token?.access)
        // setSocket(socket)
        const socket=startSocket()
        // socket.onopen = ()=>{
        //     setReady(true);
        // }
        // socket.onclose = ()=>console.log("ws closed")

        socket.onmessage=e=>{
            const response =JSON.parse(e.data) as SocketResponse
            if(response.type=="room-created"){
                const room = JSON.parse(e.data) as {room_id:string, room_slug:string}
                navigate(room.room_slug+"/join/"+room.room_id)
            }
            setMessage(e)
        }

        return ()=>{
            socket.close()
            setReady(false)
        }
    }, [])

    function sendData(data:string){
        if(ws && isReady){
            ws.send(data)
        }
    }
  
    return (
    <SocketContext.Provider value={{
        ws:ws,
        isReady,
        message,
        sendData
    }}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider

export function useSocket(){
    return useContext(SocketContext)
}