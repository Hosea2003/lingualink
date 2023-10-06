import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Route, useLocation, useNavigate } from 'react-router-dom'

function PrivateRoute({ children }: { children: React.ReactElement}) {
  const {token, refreshTokenValid}=useAuth()
  const location = useLocation()

  const isAuthenticated=token && (refreshTokenValid())

  return isAuthenticated?children:<Navigate to={'/login?redirect='+location.pathname}/>

  
}

export default PrivateRoute