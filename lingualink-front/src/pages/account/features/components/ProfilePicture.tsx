import React, { useState } from 'react'
import { API_URI } from '../../../../const/API'
import ActionButtons from './ActionButtons'
import useAxios from '../../../../hooks/useAxios'
import { toast } from 'react-toastify'

type ProfilePictureProps={
  image?:string
  username:string
  email:string
}

function ProfilePicture(props:ProfilePictureProps) {
  
  const pf = props.image?`${API_URI}${props.image}`:require('../../../../assets/images/avatar.jpg')
  const [isEdit, setEdit]=useState(false)
  const [file, setFile]=useState<File|null>(null)
  const [pic, setPic]=useState(pf)
  const axios=useAxios()

  function handleChange(event:React.ChangeEvent<HTMLInputElement>){
      if(event.target.files){
        const image = event.target.files[0]
        setPic(URL.createObjectURL(image))
        setFile(image)
      }
  }

  function saveImage(){
      toast.promise(upload,{
        success:'Profile picture changed',
        pending:'Uploading picture',
        error:'An error occured'
      })
  }

  async function upload(){

    if(file){
      const formData=new FormData()
      formData.append('image_url', file)

      await axios.post(
        '/user/change_picture',
        formData,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }
      )

      setEdit(false)
    }
  }

  return (
    <div className='profile-picture account-card'>
        <div className="left">
            <div className="image-container">
              <img src={pic} alt="" className='picture'/>
              {
                isEdit && (<>
                  <input type="file" id="pf" onChange={handleChange}/>
                  <label htmlFor="pf">
                    <img src={require('../../../../assets/images/icons8_camera_52px.png')} alt="" />
                  </label>
                </>)
              }
            </div>
            <div className="personal-review">
                <span className="name">{props.username}</span>
                <div className="email">{props.email}</div>
            </div>
        </div>
        <ActionButtons onEditClick={()=>setEdit(true)} isEdit={isEdit}
          onCancelClick={()=>{
            setEdit(false)
            setPic(pf)
          }}
          onSaveClick={()=>saveImage()}/>
    </div>
  )
}

export default ProfilePicture