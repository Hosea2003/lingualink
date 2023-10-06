import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DecodedToken, OrganizationType } from '../../../../types/types'
import BasicInfoOrganization from './BasicInfoOrganization'
import { ClipLoader } from 'react-spinners'
import useAxios from '../../../../hooks/useAxios'
import '../assets/css/manage-organization.css'
import { LinguaUser } from '../../../../types/user'
import OrganizationMembers from './OrganizationMembers'
import jwtDecode from 'jwt-decode'
import {useAuth} from '../../../../hooks/useAuth'

function ManageOrganization() {

    const {slug}=useParams()
    const [organization, setOrganization]=useState<OrganizationType>()
    const axios = useAxios()
    const {token}=useAuth()
    const userId = (jwtDecode(token!.access) as DecodedToken).user_id

    useEffect(()=>{
        async function getOrganization(){
            const {data}=await axios.get<OrganizationType>(
                '/organization/view-details/'+slug
            )
            setOrganization(data)
        }
        getOrganization()
    }, [slug])

  return (
    <div className='manage-organization'>
        {!organization ? (
            <ClipLoader 
                color='blue'
                loading={!organization}
                size={25}/>
        ):(
            <>
                <BasicInfoOrganization organization={organization}
                    isAdmin={userId===organization.admin?.id}/>
                <OrganizationMembers size={organization.members!} 
                    organization={organization}
                    isAdmin={userId===organization.admin?.id}/>
                
            </>
        )}
    </div>
  )
}

export default ManageOrganization