import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Overview from './organization/Overview'
import CreateOrganizationWrapper from './organization/CreateOrganizationWrapper'
import ManageOrganization from './organization/ManageOrganization'
import JoinOrganization from './organization/JoinOrganization'

function Organization() {
  return (
    <div className='organisation'>
        <h3 className="account-setting-title">Organization</h3>
        <Routes>
          <Route path='/' element={<Overview/>}/>
          <Route path='create' element={<CreateOrganizationWrapper/>}/>
          <Route path=':slug' element={<ManageOrganization/>}/>
          <Route path='join-organization/:slug' element={<JoinOrganization/>}/>
        </Routes>
    </div>
  )
}

export default Organization