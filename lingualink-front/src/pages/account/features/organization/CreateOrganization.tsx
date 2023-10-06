import React, { Fragment, useState } from 'react'
import CustomInput from '../../../../components/CustomInput'
import OrganizationImage from '../assets/images/organization.jpg'
import '../assets/css/create-organization.css'
import InvitePeople from './InvitePeople'
import { useInvitePeople } from '../hooks/useInvitePeople'
import useAxios from '../../../../hooks/useAxios'
import { OrganizationType } from '../../../../types/types'
import {toast} from 'react-toastify'

function CreateOrganization() {

    const [picture, setPicture]=useState(OrganizationImage)
    const [file, setFile]=useState<File|null>(null)
    const [inviteOpen, setInviteOpen]=useState(false)
    const [name, setName]=useState('')
    const {peoples}=useInvitePeople()
    const axios=useAxios()

    async function createOrganizationRequest(){

      const formData = new FormData()
      formData.append('name', name)
      file &&  formData.append('picture', file)

      const {data}=await axios.post<OrganizationType>(
        '/organization/create-organization',
        formData,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }
      )

      axios.post<OrganizationType>(
        '/organization/'+data.id+'/invite-people',
        {
          users:peoples.map(p=>p.id)
        }
      )
    }

    function handleCreate(){
      toast.promise(createOrganizationRequest, {
        pending:'Creating organization',
        success:'Organization created',
        error:'Failed creating organization'
        });
    }

    function handleChangePicture(event:React.ChangeEvent<HTMLInputElement>){
      if(event.target.files){
        const image = event.target.files[0]
        setPicture(URL.createObjectURL(image))
        setFile(image)
      }
    }

  return (
    <Fragment>
        <span className="label">Public name</span>
        <CustomInput placeholder='ex: Heroes' onChangeText={(text)=>setName(text)}/>
        <span className="label">Public picture</span>
        <div className="organization-picture">
            <img src={picture} alt="" />
            <label htmlFor="pic">Choose Image</label>
            <input type="file" name="organization-picture" className='pic' id='pic'
            onChange={(event)=>handleChangePicture(event)} accept='image/*'/>
        </div>

        <div className="invite-labels">
          <span className="label">Invite people</span>
            <span className="invited">{peoples.length} invited</span>
        </div>
        
        <div className="invite-container">
          <button className="open-invitation" onClick={()=>setInviteOpen(true)}>Invite</button>
          <InvitePeople isOpen={inviteOpen} onBackdropClick={()=>setInviteOpen(!inviteOpen)}/>
        </div>
        <button className="create-btn" onClick={handleCreate}>Create</button>
    </Fragment>
  )
}

export default CreateOrganization