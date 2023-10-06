import React, { useState } from 'react'
import { DecodedToken, OrganizationType } from '../../../../types/types'
import CustomInput from '../../../../components/CustomInput'
import ActionButtons from '../components/ActionButtons'
import EditableComponent from '../components/EditableComponent'
import { useAuth } from '../../../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import { API_URI } from '../../../../const/API'
import useAxios from '../../../../hooks/useAxios'
import { toast } from 'react-toastify'

function BasicInfoOrganization({organization, isAdmin}:{organization:OrganizationType, isAdmin:boolean}) {
  
    const [picture, setPicture]=useState(()=>{
        if(organization.picture)return API_URI+organization.picture
        return require('../assets/images/organization.jpg')
    })
    const [file, setFile]=useState<File|null>(null)
    const [name, setName]=useState(organization.name)
    const [edit, setEdit]=useState(false)
    const axios = useAxios()

    function handleChangePicture(event:React.ChangeEvent<HTMLInputElement>){
        if(event.target.files){
          const image = event.target.files[0]
          setPicture(URL.createObjectURL(image))
          setFile(image)
        }
      }

    async function saveChange(){
        const formData = new FormData()
        formData.append('name', name)
        file &&  formData.append('picture', file)

        await axios.post<OrganizationType>(
            '/organization/update/'+organization.id,
            formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
            }
        )
    }

    function handleSave(){
        toast.promise(saveChange, {
            success:"updated successfully",
            pending:"we are saving your update",
            error:"There was an errors"
        })
    }
  
    return (
    <div className='organization-detail'>
        <div className="information">
            <span className="label">Public name</span>
            <EditableComponent defaultValue={organization.name}
                editable={edit}/>
            <span className="label">Public picture</span>
            <div className="organization-picture">
                <img src={picture} alt="" />
                {edit && (<>
                    <label htmlFor="pic">Choose Image</label>
                    <input type="file" name="organization-picture" className='pic' id='pic'
                    onChange={(event)=>handleChangePicture(event)} accept='image/*'/>
                </>)}
            </div>
        </div>
        {isAdmin&&(
            <ActionButtons onEditClick={()=>setEdit(true)}
            onCancelClick={()=>setEdit(false)} isEdit={edit}
            onSaveClick={()=>handleSave()}/>
        )}
        
    </div>
  )
}

export default BasicInfoOrganization