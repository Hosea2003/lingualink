import React, { FormEvent, useState } from 'react'
import CustomInput from '../../../components/CustomInput'
import './assets/css/security.css'
import useAxios from '../../../hooks/useAxios'
import { toast } from 'react-toastify'

function Security() {

  const [credentials, setCredentials]=useState({
    old_password:'',
    new_password:'',
    confirm_password:'',
  })

  const axios = useAxios()

  async function changePassword(event:FormEvent){
    event.preventDefault()

    const {data}=await axios.post<{message:string}>(
      '/user/change-password',
      credentials
    )

    if(data.message==='success'){
      toast('👌Password changed', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    else{
      toast.warn(data.message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }

  return (
    <div className='security'>
        <h3 className="account-setting-title">Security Settings</h3>
        <form className="change-password account-card" onSubmit={changePassword}>
            <h5>Change password</h5>
            <CustomInput placeholder='Your old password' type='password'
              onChangeText={(text)=>setCredentials({...credentials, old_password:text})}/>
            <CustomInput placeholder='New password' type='password'
              onChangeText={(text)=>setCredentials({...credentials, new_password:text})}/>
            <CustomInput placeholder='Confirm password' type='password'
              onChangeText={(text)=>setCredentials({...credentials, confirm_password:text})}/>
            {
              credentials.new_password.length>0 && credentials.new_password==credentials.confirm_password &&
              <button className="change-password-btn">Confirm</button>
            }
        </form>
    </div>
  )
}

export default Security