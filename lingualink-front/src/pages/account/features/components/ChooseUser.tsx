import React from 'react'
import UserListItem, { UserListItemProps } from '../../../../components/UserListItem'

type ChooseUserProps={
    checked:boolean
    value:number
    onChecked?:(checked:boolean)=>void
}& UserListItemProps

function ChooseUser(props:ChooseUserProps) {
  return (
    <div className='choose-user'>
        <input type="checkbox" id={`choose-user-${props.value}`}
            defaultChecked={props.checked} defaultValue={props.value}
            onChange={(event)=>props.onChecked && props.onChecked(event.target.checked)}/>
        <label htmlFor={`choose-user-${props.value}`} className='item'>
            <UserListItem display_name={props.display_name} profile_picture={props.profile_picture}/>
        </label>
    </div>
  )
}

export default ChooseUser