import React from 'react'
import { RoomLanguage } from '../../../../types/room'

function LanguageComponent({language}:{language:RoomLanguage}) {
  return (
    <div className='language-component'>
        <span>{language.language.name}</span>
        <span>{language.translator.email}</span>
        <button className="delete-language">
            <img src={require('../../../../assets/images/remove.png')} alt="" />
        </button>
    </div>
  )
}

export default LanguageComponent