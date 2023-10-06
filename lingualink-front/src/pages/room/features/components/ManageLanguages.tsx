import React, { useContext, useEffect, useState } from 'react'
import { RoomLanguage } from '../../../../types/room'
import { ManageRoomContext } from '../ManageRoom'
import LanguageComponent from './LanguageComponent'
import NewLanguage from './NewLanguage'

function ManageLanguages() {

    const {room}=useContext(ManageRoomContext)
    const [languages, setLanguages]=useState<RoomLanguage[]|undefined>(room.languages)
    const [open, setOpen]=useState(false)

  return (
    <div className='white-card'>
        <h3>Languages</h3>
        <button className="add-language"
            onClick={()=>setOpen(true)}>Add</button>
        <div className="languages">
        {languages?.map((l, index)=>(
            <LanguageComponent language={l} key={index}/>
        ))}
        </div>
        <NewLanguage isOpen={open} onBackdropClick={()=>setOpen(false)}
            room={room}
            onLanguageAdded={(language)=>setLanguages(prev=>{
                if(prev)return [...prev, language]
                return []
            })}/>
    </div>
  )
}

export default ManageLanguages