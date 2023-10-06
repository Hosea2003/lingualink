import React, { useEffect, useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import CustomInput from '../../../../components/CustomInput'
import { LinguaUser } from '../../../../types/user'
import useAxios from '../../../../hooks/useAxios'
import InviteUser from '../components/InviteUser'

type InviteMemberProps={
    onBackdropClick:()=>void
    isOpen:boolean
    organizationId:number
}

function InviteMember(props:InviteMemberProps) {

    const [users, setUsers]=useState<LinguaUser[]>([])
    const [search, setSearch]=useState('')
    const axios = useAxios()

    useEffect(()=>{

        async function fetchData(){
            const {data}=await axios.get<LinguaUser[]>(
                '/organization/search-user-to-invite/'+props.organizationId,
                {
                    params:{
                        search:search
                    }
                }
            )
            setUsers(data)
        }

        if(search.length===0)return
        fetchData()
    }, [search])

  return props.isOpen? (
    <Modal onBackdropClick={()=>{
        props.onBackdropClick()
        setUsers([])
        setSearch('')
    }}
        title='Invite member'>
            <CustomInput placeholder='Search user'
                onChangeText={(text)=>setSearch(text)}/>
            <div className="members-result">
                {users.map((u, index)=>(
                    <InviteUser user={u} key={index} organizationId={props.organizationId}/>
                ))}
            </div>
    </Modal>
  ):null
}

export default InviteMember