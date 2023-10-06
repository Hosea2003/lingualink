import React, { useEffect, useState } from 'react'
import CustomInput from '../../components/CustomInput'
import useAxios from '../../hooks/useAxios'
import { LinguaUser } from '../../types/user'
import UserMessageItem from './UserMessageItem'

function UserList() {

    const [users, setUsers]=useState<LinguaUser[]>([])
    const [search, setSearch]=useState('')
    const axios = useAxios()

    useEffect(()=>{
        async function fetchUsers(){
            const {data}=await axios.get<LinguaUser[]>(
                '/message/get-users',{
                    params:{
                        search:search
                    }
                }
            )
            setUsers(data)
        }
        fetchUsers()
    }, [search])

  return (
    <div className='users-list'>
        <CustomInput placeholder='Search user'
            onChangeText={(text)=>setSearch(text)}/>
        <div className="list">
            {users.map((u, index)=>(
                <UserMessageItem user={u}
                key={index}/>
            ))}
        </div>
    </div>
  )
}

export default UserList