import React, { useState } from 'react'
import EditButton from './EditButton'
import '../assets/css/personal-info.css'
import EditableComponent from './EditableComponent'
import ActionButtons from './ActionButtons'
import Choices from '../../../../components/Choices'
import Choice from '../../../../components/Choice'
import useAxios from '../../../../hooks/useAxios'
import { toast } from 'react-toastify'

type PersonalInfoProps={
    first_name:string
    last_name:string
    birthdate:string
    gender:string
}

function PersonalInfo(props:PersonalInfoProps) {

    const [isEdit, setEdit]=useState(false)
    const [user, setUser]=useState<PersonalInfoProps>(props)
    const axios = useAxios()

    async function saveChange(){
        try{
            await axios.post(
                '/user/update-profile',
                user
            )
            toast('👌 Profile updated', {
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
        catch{
            toast('❗Error while updating!', {
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
        setEdit(false)
    }

  return (
    <div className='account-card personal-info'>
        <div className="head">
            <h4 className='title'>Personnal info</h4>
            <ActionButtons onEditClick={()=>setEdit(true)} isEdit={isEdit}
            onCancelClick={()=>setEdit(false)} onSaveClick={saveChange}/>
        </div>
        <div className="information">
            <div className="info-container">
                <label className='info-label'>First name</label>
                <EditableComponent defaultValue={props.first_name} editable={isEdit}
                    onChangeText={(text)=>setUser({...user, first_name:text})}/>
            </div>
            <div className="info-container">
                <label className='info-label'>Last name</label>
                <EditableComponent defaultValue={props.last_name} editable={isEdit}
                    onChangeText={(text)=>setUser({...user, last_name:text})}/>
            </div>
            <div className="info-container">
                <label className='info-label'>Birthdate</label>
                <EditableComponent defaultValue={props.birthdate} editable={isEdit} type='date'
                    onChangeText={(text)=>setUser({...user, birthdate:text})}/>
            </div>
            <div className="info-container">
                <span className="info-label">Gender</span>
                <Choices defaultSelected={props.gender==='MALE'?0:1}
                    onChange={(value)=>setUser({...user, gender:value})}
                    disable={!isEdit}>
                    <Choice text='MALE' value='MALE'/>
                    <Choice text='FEMALE' value='FEMALE'/>
                </Choices>
            </div>
        </div>
        
    </div>
  )
}

export default PersonalInfo