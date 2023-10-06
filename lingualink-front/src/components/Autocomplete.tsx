import React, {  useRef, useState } from 'react'
import CustomInput from './CustomInput'
import '../assets/css/autocomplete.css'
import useAxios from '../hooks/useAxios'
import { ClipLoader } from 'react-spinners'
import { IAutoCompleteProps } from '../types/types'
import { SuggestionItem } from './AutocompleteText'

type AutocompleteProps<T>={
    render:(option:T, onSelect:(value:IAutoCompleteProps)=>void)=>React.ReactNode
    onSelect?:(value:IAutoCompleteProps|null)=>void
    fetchTo:string
}

function Autocomplete<T>(props:AutocompleteProps<T>) {

    const [loading, setLoading]=useState(true)
    const [options, setOptions]=useState<T[]>([])
    const [showSuggestion, setShowSuggestion]=useState(false)
    const [selected, setSelected]=useState<IAutoCompleteProps | null>(null)
    const axios = useAxios()

    const handleChange=async (value:string)=>{
        if(value===''){
            setLoading(false)
            setShowSuggestion(false)
            return
        }
        setShowSuggestion(true)
        const {data}= await axios.get<T[]>(
            props.fetchTo,
            {
                params:{
                    search:value
                }
            }
        )

        setLoading(false)
        setOptions(data)
    }

    function handleSelect(value:IAutoCompleteProps){
        setSelected(value)
        setShowSuggestion(false)
        props.onSelect && props.onSelect(value)
    }

  return (
    <div className='autocomplete'>
        <CustomInput 
            onChangeText={(value)=>handleChange(value)} disabled={selected?true:false}
                defaultValue={''}/>
        {
            selected && (
                <div className="option-selected">
                    <span>{selected.displaySelect}</span>
                    <button className="cancel-btn" onClick={()=>{
                        setSelected(null)
                        props.onSelect && props.onSelect(null)
                    }}>x</button>
                </div>
            )
        }
        <div className={showSuggestion?"suggestion show":"suggestion"}>
            {options.map((option,index)=>(
                    <li key={index} className='li-item' >
                        {props.render(option, handleSelect)}
                    </li>
            ))}
        </div>
    </div>
  )
}

export default Autocomplete