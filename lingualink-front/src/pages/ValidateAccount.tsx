import React, { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CustomInput from '../components/CustomInput'
import "../assets/css/validate-account.css"
import LinguaImage from '../assets/images/login.jpg'
import axios from 'axios'
import { API_URI } from '../const/API'
import { useAuth } from '../hooks/useAuth'
import { Token } from '../types/types'

function ValidateAccount() {

    const location=useLocation().search
    const username=new URLSearchParams(location).get("username")

    const [message, setMessage]=useState<string|null>(null)
    const [code, setCode]=useState("")
    const navigate=useNavigate()
    const {saveToken}=useAuth()

    async function validate(event:FormEvent){
        event.preventDefault()
        try{
            const {data}=await axios.post<Token>(
                API_URI+"/user/validate",
                {
                    username:username,
                    code:code
                }
            )
            saveToken(data)
            navigate("/room")
        }
        catch{
            setMessage("Sending code to email failed")
        }
    }

    async function sendCode(){
        try{
            const {data}=await axios.post(
                API_URI+"/user/send-code",
                {
                    username:username
                }
            )
            setMessage(data.message)
        }
        catch{
            setMessage("Sending code to email failed")
        }
    }

  return (
    <div className='validate-account-container'>
        <img src={LinguaImage} alt="" className='lingua-image'/>
       <form className="validate-account-form" onSubmit={validate}>
            <h3>Validate your account</h3>
            <p>We have sent a code to your email, Mr/Ms {username}</p>
            {message && <p className='message'>{message}</p>}
            <CustomInput placeholder='Code' onChangeText={(text)=>setCode(text)}>
                <button className="validate-btn">Validate</button>
            </CustomInput>
            <button className="send-code" onClick={sendCode} type='button'>Send code</button>
       </form>
    </div>
  )
}

export default ValidateAccount