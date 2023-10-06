import React from 'react'
import { Link } from 'react-router-dom'

type OrganizationListItemProps={
    name:string
    slug:string
    displayDate:string
}

function OrganizationListItem(props:OrganizationListItemProps) {
  return (
    <div className='organization-list-item'>
        <Link to={props.slug} className='organization-name'>{props.name}</Link>
        <span className="display-date">{props.displayDate}</span>
    </div>
  )
}

export default OrganizationListItem