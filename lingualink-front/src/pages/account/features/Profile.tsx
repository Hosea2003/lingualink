import React, { useEffect, useState } from 'react'
import './assets/css/profile.css'
import ProfilePicture from './components/ProfilePicture'
import PersonalInfo from './components/PersonalInfo'
import useAxios from '../../../hooks/useAxios'
import { LinguaUser } from '../../../types/user'

function Profile() {

  const axios = useAxios()
  const [user, setUser]=useState<LinguaUser|null>(null)

  useEffect(()=>{
    async function fetchData(){
      const {data}=await axios.get(
        '/user/get-profile'
      )
      setUser(data)
    }
    fetchData()
  }, [])

  return (
    <div className='profile'>
      <h3 className="account-setting-title">My Profile</h3>
      {/* add loading later */}
      {user && (
        <>
          <ProfilePicture image={user.profile_picture} username={user.username} email={user.email}/>
          <PersonalInfo first_name={user.first_name} last_name={user.last_name}
            birthdate={user.birthdate} gender={user.gender}/>
        </>
      )}
    </div>
  )
}

export default Profile
