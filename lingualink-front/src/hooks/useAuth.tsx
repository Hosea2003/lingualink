import React, { createContext, useContext, useState } from 'react'
import { DecodedToken, Token } from '../types/types'
import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'

type AuthContextProps={
    token:Token|null
    saveToken:(new_token:Token|null)=>void
    accessTokenValid:()=>boolean
    refreshTokenValid:()=>boolean
}

const AuthContext=createContext<AuthContextProps>({
    token:null,
    saveToken:(new_token:Token|null)=>{},
    accessTokenValid:()=>false,
    refreshTokenValid:()=>false
})

function AuthProvider({children}:any) {

    const [token, setToken]=useState(()=>{
        const _token = localStorage.getItem('token')
        if(_token){
            return JSON.parse(_token) as Token
        }
        return null
    })

    const validToken=(access:boolean=true)=>{
        if(token){
            const _=access ? token.access : token.refresh
            const decoded= jwtDecode(_) as DecodedToken
            const expired = dayjs.unix(decoded.exp).diff(dayjs())<1
            return !expired
        }
        return false
    }

    const accessTokenValid=()=>{
        return validToken()
    }

    const refreshTokenValid=()=>{
        return validToken(false)
    }

    function saveToken(new_token:Token|null){
        localStorage.setItem("token", JSON.stringify(new_token))
        setToken(new_token)
    }

  return (
    <AuthContext.Provider value={{
        token:token,
        saveToken:saveToken,
        accessTokenValid:accessTokenValid,
        refreshTokenValid:refreshTokenValid
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export function useAuth(){
    return useContext(AuthContext)
}