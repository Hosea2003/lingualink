import React, { FormEvent, useState } from 'react'
import CustomInput from '../../components/CustomInput'
import LoginImage from '../../assets/images/login.jpg'
import '../../assets/css/login.css'
import IconButton from '../../components/IconButton'
import GoogleImage from '../../assets/images/google.png'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { API_URI } from '../../const/API'
import { Token } from '../../types/types'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'

function Login() {

    const [credentials, setCredentials]=useState({password:'', username:''})
    const [errors, setErrors]=useState<string|null>(null)
    const {saveToken}=useAuth()
    const navigate= useNavigate()
    const handleSubmit=async (event:FormEvent)=>{
        event.preventDefault()
        try{
            const {data, status}= await axios.post<Token>(
                API_URI+"/user/get-token/", credentials,{
                    headers:{
                        'Content-Type':'application/json',
                        'Accept':'application/json'
                    }
                }
            )
            saveToken(data)
            const params = new URLSearchParams(window.location.search)
            const redirect_url=params.get('redirect')
            if(redirect_url)
                navigate(redirect_url)
            else
                navigate('/')
        }

        catch(error){
            const status = (error as AxiosError)?.response?.status
            if(status===400)
                setErrors("Username or password not valid")
            else{
                navigate("/validate-account?username="+credentials.username)
            }
        }
    }

    function forgotPassword(){
        toast.promise(requestCode,{
            pending:'requesting code',
            error:'There was an error',
        })
    }

    async function requestCode(){
        await axios.post(
            API_URI+'/user/get-reset-code',{
                email:credentials.username
            }
        )
        navigate('/forgot-password?username='+credentials.username)
    }

  return (
    <div className='login-wrapper'>
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="logo">
                <img src={LoginImage} alt="Lingualink" />
                <h3>Welcome to Lingualink</h3>
            </div>
            {errors && <span className='span-error'>{errors}</span>}
            <CustomInput placeholder='Email or username' 
                onChangeText={(value)=>setCredentials({...credentials, username:value})}/>
            <CustomInput placeholder='Password' type='password'
                onChangeText={(value)=>setCredentials({...credentials, password:value})}>
                <button className='forgot-password'
                    onClick={()=>forgotPassword()} type='button'>forgot?</button>
            </CustomInput>
            <button type='submit' className='login-btn'>Login</button>

            {/* register */}
            <span className='sign-up'>
                Don't have account? <Link to={'/register'} className='sign-up-link'>Sign up</Link>
            </span>

            {/* <IconButton icon={GoogleImage} type='button'>Continue with google</IconButton> */}
        </form>
    </div>
  )
}

export default Login