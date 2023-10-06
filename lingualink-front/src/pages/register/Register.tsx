import React, { FormEvent, useState } from 'react'
import LinguaeImage from '../../assets/images/login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import IconButton from '../../components/IconButton'
import GoogleImage from '../../assets/images/google.png'
import CustomInput from '../../components/CustomInput'
import Choices from '../../components/Choices'
import Choice from '../../components/Choice'
import '../../assets/css/register.css'
import InputWithMark from '../../components/InputWithMark'
import { LinguaUser } from '../../types/user'
import axios from 'axios'
import { API_URI } from '../../const/API'

function Register() {

  const [passType, setPassType]=useState('password')

  const [user, setUser]=useState<LinguaUser>({
    email:"", username:"", gender:"FEMALE",birthdate:"",
    first_name:"", last_name:""
  })

  const [errors, setErrors]=useState({
    username:true,
    email:true
  })

  const navigate = useNavigate()

  async function checkUsername(username:string){
    const {data}=await axios.get<LinguaUser[]>(
      API_URI+"/user/get-users-by-username",{
        params:{
          search:username
        }
      }
    )
    setErrors({...errors, username:data.length>0})
    return data.length>0
  }

  async function checkEmail(email:string){
    const {data}=await axios.get<LinguaUser[]>(
      API_URI+"/user/get-users-by-email",{
        params:{
          search:email
        }
      }
    )
    setErrors({...errors, email:data.length>0})
    return data.length>0
  }


  async function handleSubmit(event:FormEvent){
    event.preventDefault()
    if(!errors.email && !errors.username){
      await axios.post(
        API_URI+"/user/register",
        user
      )
      navigate('/validate-account?username='+user.username)
    }
  }


  return (
    <div className='register'>
      <form className="register-form" onSubmit={handleSubmit} >
        <div className="left-image">
          <img src={LinguaeImage} alt="" />
          <span className='have-account'>Already have an account? </span>
          <Link to={'/login'} className='login-link'>Sign in</Link>
        </div>
        <div className="info-register">
          <h3 className="title">Welcome to lingualink</h3>
          {/* <IconButton icon={GoogleImage} type='button'>Register with google</IconButton> */}
          <div className="personal-info">
            <InputWithMark placeholder='Username' onChangeText={async (text)=>{
              const error = await checkUsername(text)
              if(error){
                return
              }
              setUser({...user, username:text})
            }} error={errors.username}/>
            <InputWithMark placeholder='email' type='email' onChangeText={async (text)=>{
              const error = await checkEmail(text)
              if(error){
                return
              }
              setUser({...user, email:text})
            }} error={errors.email}/>
            <CustomInput placeholder='Password' type={passType}
              onChangeText={(text)=>setUser({...user, password:text})}
            />
            <div className="name">
              <CustomInput placeholder='First name' 
                onChangeText={(text)=>setUser({...user, first_name:text})}/>
              <CustomInput placeholder='Last name'
                onChangeText={(text)=>setUser({...user, last_name:text})}/>
            </div>
            <CustomInput placeholder='Birthdate' type='date' onChange={(event)=>setUser({...user, birthdate:event.target.value})}/>
            <div className="gender">
              Gender
              <Choices onChange={(value)=>setUser({...user, gender:value})}>
                <Choice text='Female' value='FEMALE'/>
                <Choice text='Male' value='MALE'/>
            </Choices>
            </div>
          </div>
          {
            (!errors.email && !errors.username) && (
              <button className="register-btn">Sign up</button>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default Register