import React, { useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import CustomInput from '../../../../components/CustomInput'
import UserListItem from '../../../../components/UserListItem'
import '../assets/css/invite-people.css'
import ChooseUser from '../components/ChooseUser'
import { useInvitePeople } from '../hooks/useInvitePeople'
import { SimpleUser } from '../types'
import useAxios from '../../../../hooks/useAxios'
import { LinguaUser } from '../../../../types/user'
import { API_URI } from '../../../../const/API'

type InvitePeopleProps={
    onChange?:()=>void
    onBackdropClick:()=>void
    isOpen:boolean
}

function InvitePeople(props:InvitePeopleProps) {

  const {peoples, changeSource}=useInvitePeople()
  const [_peoples, setPeople]=useState<SimpleUser[]>(peoples)
  const [result, setResult]=useState<LinguaUser[]>([])
  const axios = useAxios()

  function alreadyChecked(id:number){
    return peoples.filter(p=>p.id===id).length>0 || _peoples.filter(p=>p.id===id).length>0
  }

  function checkUser(user:SimpleUser, checked:boolean){
    if(checked)
      setPeople([..._peoples, user])
    else
    setPeople(_peoples.filter(p=>p.id!==user.id))
  }

  async function searchUser(text:string){
    if(text.length===0){
      setResult([])
      return
    }
      const {data}=await axios.get<LinguaUser[]>(
        '/user/search-user?exclude=true&search='+text
      )
      setResult(data)
  }

  function close(){
    setResult([])
    props.onBackdropClick()
  }

  if(!props.isOpen)return null

  return (
    <Modal title='Invite people' onBackdropClick={close}>
      <CustomInput placeholder='Search people' onChangeText={searchUser}/>
      <div className="people-result">
        {
          result.map((r, index)=>(
            <ChooseUser display_name={r.email} value={r.id!} checked={alreadyChecked(r.id!)}
          onChecked={(checked)=>checkUser({display_name:r.email, id:r.id!}, checked)}
          key={index}
          profile_picture={r.profile_picture?r.profile_picture:undefined}/>
          ))
        }
      </div>
      <div className="invite-actions">
        <button className="invite" onClick={()=>{
          changeSource(_peoples)
          close()
        }}>Invite</button>
      </div>
    </Modal>
  )
}

export default InvitePeople