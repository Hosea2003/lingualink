import React from 'react'
import { Link } from 'react-router-dom'

type OrganizationComponentProps={
    img?:string
    name:string
    slug:string
}

function OrganizationComponent(props:OrganizationComponentProps) {
  return (
    <div className='organization-component'>
        <img src={props.img?props.img:require("../assets/images/organization.jpg")} alt="" />
        <Link className="navigate-to-organisation" to={props.slug}>{props.name}</Link>
    </div>
  )
}

export default OrganizationComponent