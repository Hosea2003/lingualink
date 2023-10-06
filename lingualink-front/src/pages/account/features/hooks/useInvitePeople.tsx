import React, { createContext, useContext, useState } from 'react'
import { SimpleUser } from '../types'

type InviteProps={
    peoples:SimpleUser[],
    changeSource:(new_source:SimpleUser[])=>void
}

const InvitePeopleContext = createContext<InviteProps>({
    peoples:[],
    changeSource:(new_source:SimpleUser[])=>{}
})

function InvitePeopleProvider({children}:{children?:React.ReactNode}) {

    const [peoples, setPeople]=useState<SimpleUser[]>([])

    const data:InviteProps={
        peoples,
        changeSource:(new_source:SimpleUser[])=>setPeople(new_source)
    }

  return (
    <InvitePeopleContext.Provider value={data}>
        {children}
    </InvitePeopleContext.Provider>
  )
}

export default InvitePeopleProvider

export function useInvitePeople(){
    return useContext(InvitePeopleContext)
}