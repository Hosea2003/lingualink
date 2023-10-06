import React, { useState } from 'react'
import '../../../../assets/css/addlanguage.css'
import AutocompleteText, { SuggestionItem } from '../../../../components/AutocompleteText'
import AutocompleteImage from '../../../../components/AutocompleteImage'
import { useLanguage } from '../hooks/useLanguage'
import { IAutoCompleteProps } from '../../../../types/types'

function AddLanguage({index, removeComponent, onAdd}:{index:number, removeComponent:(index:number)=>void,
                      onAdd?:(language_code:string, translator_id:number)=>void}) {

  const {languages, updateLanguages}=useLanguage()

  const [languageCode, setLanguageCode]=useState<string|null>(null)
  const [translatorId, setTransaltorId]=useState<number|null>(null)
  const [show, setShow]=useState(false)

  function add(){
      if(onAdd){
        languageCode && translatorId && onAdd(languageCode, translatorId)
        return
      }
      setShow(false)
      languageCode && translatorId &&
        updateLanguages([...languages, {language:languageCode, translator_id:translatorId}])
  }

  function selection(selected:IAutoCompleteProps|null, language=true){
      if(language)setLanguageCode(selected?selected.value.toString():null)
      else setTransaltorId(selected?parseInt(selected.value.toString()):null)

      if(!language && (languageCode)|| (language && translatorId)){
        setShow(true)
      }
  }

  function remove(){
    updateLanguages(languages.splice(index, 1))
    removeComponent(index)
  }

  return (
    <div className='add-language'>
        <div className="element">
          <label>Language</label>
        <AutocompleteText fetchTo='/room/available-languages' onSelect={(selected)=>selection(selected)}/>
        </div>
        <div className="element">
          <label>Translator</label>
        <AutocompleteImage fetchTo='/user/get-users' onSelect={(selected)=>selection(selected, false)}/>
        </div>
        {
          translatorId && languageCode && show && (
            <button className="confirm-language" onClick={add}>
              <img src={require('../../../../assets/images/add.png')} alt="" />
            </button>
          )
        }
        <button className="remove-btn" onClick={()=>remove()}>
          <img src={require('../../../../assets/images/remove.png')} alt="" />
        </button>
    </div>
  )
}

export default AddLanguage