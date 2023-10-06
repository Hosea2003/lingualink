import React from 'react'
import { IAutoCompleteProps } from '../types/types'
import { LinguaUser } from '../types/user'
import Autocomplete from './Autocomplete'
import { API_URI } from '../const/API'

function AutocompleteImageItem({option, onSelect}:{option:LinguaUser, onSelect:(value:IAutoCompleteProps)=>void}){
    
    const pf = option.profile_picture?`${API_URI}${option.profile_picture}`:require('../assets/images/avatar.jpg')

    function handleClick(){
        onSelect({displaySelect:option.username, value:option.id!})
    }
    
    return(
        <div className='autocomplete-image' onClick={()=>handleClick()}>
            <img src={pf} alt="" className="picture" />
            <span>{option.username}</span>
        </div>
    )
}

type AutocompleteProps={
    onSelect?:(value:IAutoCompleteProps|null)=>void
    fetchTo:string
}

function AutocompleteImage(props:AutocompleteProps) {
  return (
    <Autocomplete<LinguaUser> fetchTo={props.fetchTo}
            render={(option, onSelect)=>(<AutocompleteImageItem option={option}
                onSelect={(value)=>onSelect(value)}/>)}
                onSelect={props.onSelect}/>
  )
}

export default AutocompleteImage