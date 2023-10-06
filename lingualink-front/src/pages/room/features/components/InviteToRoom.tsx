import React, { useContext, useEffect, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import Modal from '../../../../components/Modal/Modal'
import CustomInput from '../../../../components/CustomInput'
import InviteComponent from './InviteComponent'
import useAxios from '../../../../hooks/useAxios'
import { ManageRoomContext } from '../ManageRoom'

type InviteToRoomProps={
    isOpen:boolean,
    onBackdropClick:()=>void
    onInvited:(invited:LinguaUser)=>void
}

function InviteToRoom(props:InviteToRoomProps) {

    const [users, setUsers]=useState<{user:LinguaUser, invitationSent:boolean}[]>([])
    const [search, setSearch]=useState('')
    const axios = useAxios()
    const {room}=useContext(ManageRoomContext)

  useEffect(()=>{
        async function loadData(){
            if(search.length===0){
                setUsers([])
                return
            }

            const {data}=await axios.get<{user:LinguaUser, invitationSent:boolean}[]>(
                '/room/search-user-to-invite/'+room.id,{
                    params:{
                        search:search
                    }
                }
            )

            console.log(data)

            setUsers(data)
    
        }

        loadData()

  }, [search])
  
    return props.isOpen? (
    <Modal onBackdropClick={()=>{
        setUsers([])
        setSearch('')
        props.onBackdropClick()
    }} title={'Invite user'}>
        <CustomInput placeholder='Search user'
            onChangeText={(text)=>setSearch(text)}/>
        <div className="invitation-result">
            {users.map((u, index)=>(
                <InviteComponent user={u.user} 
                    invitationSent={u.invitationSent}
                    key={index}/>
            ))}
        </div>
    </Modal>
  ):null
}

export default InviteToRoom