import React, { FormEvent, useEffect, useState } from 'react'
import LinguaImage from '../assets/images/login.jpg'
import CustomInput from '../components/CustomInput'
import axios from 'axios'
import { API_URI } from '../const/API'
import { Navigate, useNavigate } from 'react-router-dom'
import { Token } from '../types/types'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'
import '../assets/css/reset-password.css'

function ResetPassword() {

    
    const token = new URLSearchParams(window.location.search).get('token')

    const [passwords, setPasswords]=useState<{
        password:string,
        confirm:string
    }>({password:'', confirm:""})

    const {saveToken}=useAuth()
    const navigate=useNavigate()

    function resetPassword(event:FormEvent){
        event.preventDefault()

        if(passwords.confirm!==passwords.password){
            toast("Password didn't match")
            return
        }

        toast.promise(changePassword, {
            success:'Password changed',
            error:"an error occured",
            pending:'Changing password'
        })
    }

    async function changePassword(){
        const {data} = await axios.post<Token>(
            API_URI+'/user/reset-password',{
                code:token,
                new_password:passwords.password
            }
        )
        saveToken(data)
        navigate('/')
    }


  return token? (
    <div className='validate-account-container'>
        <img src={LinguaImage} alt="" className='lingua-image'/>
            <form className="validate-account-form" onSubmit={resetPassword}>
                <h3>Change your password</h3>
                <CustomInput placeholder='New password' onChangeText={(text)=>setPasswords({...passwords, password:text})}
                    type='password'/>
                <CustomInput placeholder='Confirm password' type='password'
                    onChangeText={(text)=>setPasswords({...passwords, confirm:text})}/>
                <button className="reset">Reset password</button>
        </form>
    </div>
  ):(
    <Navigate to={'/login'}/>
  )
}

export default ResetPassword