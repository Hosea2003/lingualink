import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LinguaUser } from '../../types/user'
import useAxios from '../../hooks/useAxios'
import { ClipLoader } from 'react-spinners'
import { API_URI } from '../../const/API'
import EditableComponent from '../account/features/components/EditableComponent'

function Profil() {

    const {id}=useParams()
    const [user, setUser]=useState<LinguaUser|null>(null)
    const axios = useAxios()

    useEffect(()=>{
        async function loadProfile(){
            const {data}=await axios.get<LinguaUser>(
                '/user/view-profile/'+id
            )

            setUser(data)
        }
        loadProfile()
    }, [id])

  return (
    <div className='message-profil'>
        {!user?(
            <ClipLoader
                loading={!user}
                color='blue'/>
        ):(
        <>
            <img src={user.profile_picture?API_URI+user.profile_picture:
                    require('../../assets/images/avatar.jpg')} alt="" className='image'/>

            <div className="personal-info">
                <label className="label">First name</label>
                <span className='value'>{user.first_name}</span>
                <label className="label">Last name</label>
                <span className='value'>{user.last_name}</span>
                <label className="label">Username</label>
                <span className='value'>{user.username}</span>
            </div> 
        </>
        )}
    </div>
  )
}

export default Profil