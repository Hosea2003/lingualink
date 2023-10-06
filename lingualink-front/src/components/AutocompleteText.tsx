import React from 'react'
import Autocomplete from './Autocomplete'
import { IAutoCompleteProps } from '../types/types'

export type SuggestionItem={
    code:string
    name:string
}

function AutocompleteTextItem({option, onSelect}:{option:SuggestionItem, 
    onSelect:(v:IAutoCompleteProps)=>void}) {

    function handleClick(){
        onSelect({displaySelect:option.name, value:option.code})
    }

  return (
    <div className='autocomplete-text' onClick={handleClick}>
        <span>{option.name}</span>
    </div>
  )
}

type AutocompleteProps={
    onSelect?:(value:IAutoCompleteProps|null)=>void
    fetchTo:string
}

function AutocompleteText(props:AutocompleteProps){
    return (
        <Autocomplete<SuggestionItem> fetchTo={props.fetchTo}
            render={(option, onSelect)=>(<AutocompleteTextItem option={option}
            onSelect={(value)=>onSelect(value)}/>)} 
            onSelect={props.onSelect}/>
    )
}

export default AutocompleteText