import React, { FormEvent, useEffect, useState } from 'react'
import "../assets/css/validate-account.css"
import LinguaImage from '../assets/images/login.jpg'
import CustomInput from '../components/CustomInput'
import axios from 'axios'
import { API_URI } from '../const/API'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {

    const [code, setCode]=useState('')
    const [username, setUsername]=useState('')

    const navigate=useNavigate()

    async function requestCode(event:FormEvent){
        event.preventDefault()
        const {data}=await axios.post<{code:string}>(
            API_URI+'/user/get-authorization-code',{
                code:code,
                username:username
            }
        )
        navigate('reset-password?token='+data.code)
    }

    useEffect(()=>{
        const search = new URLSearchParams(window.location.search)
        const username=search.get('username')
        if(!username)navigate('/login')
        else{
            setUsername(username)
        }
    }, [])

  return (
    <div className='validate-account-container'>
        <img src={LinguaImage} alt="" className='lingua-image'/>
            <form className="validate-account-form" onSubmit={requestCode}>
                    <h3>Forgot password? don't worry</h3>
                    <CustomInput placeholder='Code' onChangeText={(text)=>setCode(text)}
                        type='text'>
                        <button className="validate-btn">Reset</button>
                    </CustomInput>
        </form>
    </div>
  )
}

export default ForgotPassword