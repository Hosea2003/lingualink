import React from 'react'
import '../../assets/css/account.css'
import AccountNavbar from './features/components/AccountNavbar'
import { Route, Routes } from 'react-router-dom'
import Profile from './features/Profile'
import Security from './features/Security'
import Organization from './features/Organization'
import Billing from './features/Billing'

function Account() {
  return (
    <div className='account'>
        <AccountNavbar/>
        <div className="account-pages">
          <Routes>
              <Route path='/' element={<Profile/>}/>
              <Route path='security' element={<Security/>}/>
              <Route path='organisation/*' element={<Organization/>}/>
              <Route path='billing' element={<Billing/>}/>
            </Routes>
        </div>
    </div>
  )
}

export default Account