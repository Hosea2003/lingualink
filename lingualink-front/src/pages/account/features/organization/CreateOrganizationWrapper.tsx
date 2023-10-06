import React from 'react'
import InvitePeopleProvider from '../hooks/useInvitePeople'
import CreateOrganization from './CreateOrganization'

function CreateOrganizationWrapper() {
  return (
    <div className='create-organization'>
        <InvitePeopleProvider>
            <CreateOrganization/>
        </InvitePeopleProvider>
    </div>
  )
}

export default CreateOrganizationWrapper