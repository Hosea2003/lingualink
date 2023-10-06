import React,{useState} from 'react'
import Choice, { ChoiceProps } from './Choice'

type ChoicesProps={
    children:React.ReactElement<ChoiceProps>|React.ReactElement<ChoiceProps>[]
    onChange?:(value:string)=>void
    defaultSelected?:number
    disable?:boolean
}

function Choices(props:ChoicesProps) {
    let children:React.ReactElement<ChoiceProps>[]=[]

    const [selectedIndex, setSelectedIndex]=useState<number>(props.defaultSelected?props.defaultSelected:0)

    if(React.isValidElement(props.children)){
        children.push(props.children)
    }
    if(Array.isArray(props.children)){
        props.children.forEach(child=>{
            if(React.isValidElement(child)){
                children.push(child)
            }
        })
    }


    const handleSelect=(index:number, value:string)=>{
        if(props.disable)return
        
        setSelectedIndex(index)
        props.onChange && props.onChange(value)
    }

  return (
    <div className='choices' style={{display:'flex',gap:'.5rem'}}>
        {children.map((child, index)=>(
            <Choice
                text={child.props.text}
                onSelect={handleSelect}
                index={index}
                key={index}
                selectedIndex={selectedIndex}
                value={child.props.value}
            />
        ))}
    </div>
  )
}

export default Choices