import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../assets/css/navbar.css'

function Navbar() {

    const {refreshTokenValid, saveToken}=useAuth()

    const is_valid = refreshTokenValid()

    const navigate = useNavigate()

    function logOut(){
        navigate('/login')
        saveToken(null)
        localStorage.removeItem('token')
    }

  return (
    <div className="navbar">
        <div className="left">
            <div className="nav-logo">
                <span className="logo">Lingualink</span>
            </div>
            <div className="NavLinks">
                <NavLink to={'/'} className='link'>Home</NavLink>
                {is_valid && (<NavLink to={'/room'} className='link'>Room</NavLink>)}
                <NavLink to={'/pricing'} className='link'>Pricing</NavLink>
            </div>
        </div>
        <div className="auth-NavLinks">
            {!is_valid ?(
                <Link to={'/login'} className='auth-link'>Sign in</Link>
            ):(
                <div className='authenticated'>
                    <Link className='user-profile'  to={'/message'}>
                        <img src={require('../assets/images/messenger.png')} alt="" />
                    </Link>
                    <Link className="user-profile" to={"/account"}>
                        <img src={require("../assets/images/user.png")} alt="" />
                    </Link>
                    <button className='auth-link' onClick={logOut}>Log out</button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Navbar