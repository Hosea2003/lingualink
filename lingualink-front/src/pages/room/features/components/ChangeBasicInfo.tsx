import React, { useContext, useState } from 'react'
import EditableComponent from '../../../account/features/components/EditableComponent'
import { ManageRoomContext } from '../ManageRoom'
import ActionButtons from '../../../account/features/components/ActionButtons'
import useAxios from '../../../../hooks/useAxios'
import { toast } from 'react-toastify'

function ChangeBasicInfo() {

    const context=useContext(ManageRoomContext)
    const [isEdit, setEdit]=useState(false)
    const axios = useAxios()
    const [detail, setDetail]=useState<{
        name:string,
        description:string,
        scheduled:string
    }>({
        name:context.room.name,
        description:context.room.description,
        scheduled:context.room.scheduled
    })

    async function saveModification(){
        return await axios.post(
            '/room/update-room/'+context?.room.id,
            detail
        )
    }

    function handelSave(){
        toast.promise(saveModification,{
            pending:'Updating room',
            success:"room updated",
            error:"there was an error"
        })
    }

  return (
    <div className='white-card'>
        {context &&(
            <>
                <h3>About this room</h3>
                <div className="information">
                    <label className='info-label'>Name</label>
                    <EditableComponent defaultValue={context.room.name}
                        editable={isEdit}
                        onChangeText={(text)=>setDetail({...detail, name:text})}/>

                    <label className='info-label'>Date</label>
                    <EditableComponent defaultValue={context.room.scheduled.split('T')[0]}
                        type='date'
                        editable={isEdit}
                        onChangeText={(text)=>{
                            setDetail(prev=>{
                                const time = prev.scheduled.split(' ')[1]
                                return {...prev, scheduled:text+' '+time}
                            })
                        }}/>
                    <label className='info-label'>Time</label>
                    <EditableComponent defaultValue={context.room.scheduled.split('T')[1].split('Z')[0]}
                        type='time'
                        editable={isEdit}
                        onChangeText={(text)=>{
                            setDetail(prev=>{
                                const date = prev.scheduled.split(' ')[0]
                                return {...prev, scheduled:date+' '+text}
                            })
                        }}/>
                    <span className='info-label'>Description</span>
                    <textarea rows={10} disabled={!isEdit} defaultValue={context.room.description}
                    onChange={(event)=>setDetail({...detail, description:event.target.value})}></textarea>
                </div>
                <ActionButtons isEdit={isEdit}
                    onEditClick={()=>setEdit(true)}
                    onCancelClick={()=>setEdit(false)}
                    onSaveClick={()=>handelSave()}/>
                
            </>
        )}
    </div>
  )
}

export default ChangeBasicInfo