import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OrganizationComponent from './OrganizationComponent'
import '../assets/css/overview.css'
import ListOrganization from './ListOrganization'
import { OrganizationType } from '../../../../types/types'
import useAxios from '../../../../hooks/useAxios'
import { API_URI } from '../../../../const/API'

function Overview() {

  const [myOrganizations, setMyOrganizations]=useState<OrganizationType[]>([])
  const axios = useAxios()

  useEffect(()=>{
    async function fetchOrganizations(){
        const {data}= await axios.get<OrganizationType[]>(
          '/organization/admin'
        )
        setMyOrganizations(data)
    }
    fetchOrganizations()
  }, [])

  return (
    <div className='organization-overview'>
        <div className="create-head">
            <Link className="create-organization" to={'create'}>
                <img src={require('../assets/images/add.png')} alt="" />
                Create
            </Link>
        </div>
        <div className="organizations">
            {myOrganizations.map((organization, index)=>(
              <OrganizationComponent name={organization.name} slug={organization.slug!}
              img={organization.picture?
                API_URI+organization.picture
                :require("../assets/images/organization.jpg")}
              key={index}/>
            ))}
        </div>
        <ListOrganization/>
    </div>
  )
}

export default Overview