import React from 'react'
import { Room, RoomLanguage } from '../../../../types/room'
import Modal from '../../../../components/Modal/Modal'
import AddLanguage from './AddLanguage'
import useAxios from '../../../../hooks/useAxios'

type NewLanguageProps={
    room:Room, 
    onBackdropClick:()=>void,
    isOpen:boolean
    onLanguageAdded:(language:RoomLanguage)=>void
}

function NewLanguage({room, onBackdropClick, ...props}:NewLanguageProps) {
  
    const axios = useAxios()

    if(!props.isOpen)return null

    async function handleAdd(language_code:string, translator_id:number){
        const {data}= await axios.post<RoomLanguage[]>(
            '/room/insert-language/'+room.id,[
                {language_code:language_code, translator_id:translator_id}
            ]
        )

        onBackdropClick()
        props.onLanguageAdded(data[0])
    }
  
    return (
    <Modal onBackdropClick={()=>onBackdropClick()} title={'Add language'}>
        <AddLanguage index={0} removeComponent={()=>onBackdropClick()}
        onAdd={handleAdd}/>
    </Modal>
  )
}

export default NewLanguage