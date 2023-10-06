import React, { useEffect, useState } from 'react'
import '../assets/css/list-organization.css'
import OrganizationListItem from '../components/OrganizationListItem'
import { OrganizationType } from '../../../../types/types'
import useAxios from '../../../../hooks/useAxios'

function ListOrganization() {

  const [organizations, setOrganizations]=useState<OrganizationType[]>([])
  const [name, setName]=useState('')
  const axios = useAxios()

  useEffect(()=>{
    async function fetchOrganizations(){
      const {data}=await axios.get<OrganizationType[]>(
        'organization/organizations-member?name='+name,
      )
      setOrganizations(data)
    }
    fetchOrganizations()
  }, [name])

  return (
    <div className='list-organization'>
        <div className="head">
            <div className="search-organization">
                <img src={require("../../../../assets/images/search.png")} alt="" />
                <input type="text" className="search-organization-input" placeholder='Search an organization'
                  onChange={(event)=>setName(event.target.value)}/>
            </div>
        </div>
        <div className="organizations">
            {
              organizations.map((organization, index)=>(
                <OrganizationListItem name={organization.name} slug={organization.slug!} 
                displayDate={organization.created_at} key={index}/>
              ))
            }
        </div>
    </div>
  )
}

export default ListOrganization