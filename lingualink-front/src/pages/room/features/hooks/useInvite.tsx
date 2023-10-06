import React, { createContext, useContext, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import { OrganizationType } from '../../../../types/types'

type InviteProps={
    people:LinguaUser[],
    organizations:OrganizationType[],
    updatePeople:(new_source:LinguaUser[])=>void
    updateOrganizations:(new_source:OrganizationType[])=>void
}

const InviteContext = createContext<InviteProps>({
    people:[],
    organizations:[],
    updateOrganizations:()=>{},
    updatePeople:()=>{},
})

function InviteProvider({children}:{children:React.ReactNode}) {

    const [people, setPeople]=useState<LinguaUser[]>([])
    const [organizations, setOrganizations]=useState<OrganizationType[]>([])

  return (
    <InviteContext.Provider value={{
        people,
        organizations,
        updateOrganizations:(new_value:OrganizationType[])=>setOrganizations(new_value),
        updatePeople:(new_value:LinguaUser[])=>setPeople(new_value),
    }}>
        {children}
    </InviteContext.Provider>
  )
}

export default InviteProvider

export function useInvite(){
    return useContext(InviteContext)
}