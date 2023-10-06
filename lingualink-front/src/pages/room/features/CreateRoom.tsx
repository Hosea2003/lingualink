import React, { useState } from 'react'
import CustomInput from '../../../components/CustomInput'
import '../../../assets/css/create-room.css'
import AddLanguage from './components/AddLanguage'
import Choices from '../../../components/Choices'
import Choice from '../../../components/Choice'
import { useLanguage } from './hooks/useLanguage'
import { Room } from '../../../types/room'
import InvitePeopleToRoom from './components/InvitePeopleToRoom'
import { useInvite } from './hooks/useInvite'
import useAxios from '../../../hooks/useAxios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function CreateRoom() {

  const {people, organizations}=useInvite()
  const [now, setNow]=useState<boolean>(true)
  const {languages}=useLanguage()
  const [addLanguages, setAddLanguages]=useState<Number[]>([])
  const [room, setRoom]=useState<Room>({
    name:'',
    description:'',
    type_of:'OTA',
    scheduled:''
  })
  const axios = useAxios()
  const navigate=useNavigate()

  const [openInvitation, setOpenInvitation]=useState(false)

  function addLanguageComponent(){
    const temp = [...addLanguages]
    temp.push(temp.length)
    setAddLanguages(temp)
  }

  function removeComponent(index:number){
    setAddLanguages(prev=>prev.filter(l=>l!==index))
  }

  function setSchedule(value:string, isDate=true){
      const schedule = room.scheduled.split(' ')
      if(isDate)setRoom({...room, scheduled:`${value} ${schedule[0]}`})
      else{
        setRoom({...room, scheduled:`${schedule[0]} ${value}`})
      }
  }

  async function handleRequest(){
      const object={
        name:room.name,
        description:room.description,
        type_of:room.type_of
      }
      let send;
      if(!now)send={...object, scheduled:room.scheduled}
      else send=object
      const {data}=await axios.post<Room>(
        '/room/create-room',
        send
      )

      await axios.post(
        '/room/insert-language/'+data.id,
        languages.map(l=>{return {language_code:l.language, translator_id:l.translator_id}})
      )

      await axios.post(
        '/room/invite-people/'+data.id,
        {
          organizations:organizations.map(o=>o.id),
          users:people.map(p=>p.email)
        }
      )
  }

  function handleCreate(){
    toast.promise(handleRequest, {
      success:'Room created',
      pending:'Creating room',
      error:'Failed to create room',
    })
  }

  return (
    <div className='create-room'>
        <h2>Schedule a meeting</h2>
        <div className="basic-info">
            <label htmlFor="name">Name</label>
            <CustomInput placeholder='Meeting name' id='name' 
              onChangeText={(text)=>setRoom({...room, name:text})}/>
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" rows={10} className="description"
              onChange={(event)=>setRoom({...room, description:event.target.value})}></textarea>
            <label htmlFor="scheduled">Schedule</label>
            <Choices defaultSelected={0} onChange={(value)=>setNow(value==='Now')}>
              <Choice text='Now' value='Now'/>
              <Choice text='Later' value='Later'/>
            </Choices>
            {
              !now && (
                <div className="schedule">
                  <CustomInput type='date' onChangeText={(text)=>setSchedule(text)}/>
                  <CustomInput type='time' onChangeText={(text)=>setSchedule(text, false)}/>
              </div>
              )
            }
            <label className="label">Policy</label>
            <Choices defaultSelected={0}>
              <Choice text='Open to All' value='OTA'/>
              <Choice text='Invited Only' value='IO'/>
            </Choices>

        </div>
        <div className="insert-language">
            <div className='basic-info'>
              <span className='title'>Add language</span>
              <button className="add" onClick={()=>addLanguageComponent()}>Add</button>
            </div>
            {
              addLanguages.map((l, index)=>(
                <AddLanguage key={index} index={index} removeComponent={(index)=>removeComponent(index)}/>
              ))
            }
        </div>
        <div className="invite-people basic-info">
          <span className="title">Invite people</span>
          <div className="content">
            <button className="invite-btn" onClick={()=>setOpenInvitation(true)}>Invite</button>
            <span className="number-invitation">{people.length} user(s), {organizations.length} organization(s)</span>
            <InvitePeopleToRoom onBackdropClick={()=>setOpenInvitation(false)}
              isOpen={openInvitation}/>
          </div>
        </div>
        <button className="create-room-btn"
        onClick={handleCreate}>Create</button>
    </div>
  )
}

export default CreateRoom