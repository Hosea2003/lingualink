import React from 'react'
import { NavLink } from 'react-router-dom'

function AccountNavbar() {
  return (
    <div className='account-navbar'>
        <NavLink className={'account-link'} to={''} end>Profile</NavLink>
        <NavLink to={'security'} className={'account-link'}>Security</NavLink>
        <NavLink to={'organisation'} className={'account-link'}>Organisation</NavLink>
        <NavLink to={'billing'} className={'account-link'}>Billing</NavLink>
        {/* <NavLink to={'export'} className={'account-link'}>Data export</NavLink> */}
    </div>
  )
}

export default AccountNavbar