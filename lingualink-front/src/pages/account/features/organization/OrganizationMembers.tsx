import React, { useEffect, useState } from 'react'
import { LinguaUser } from '../../../../types/user'
import useAxios from '../../../../hooks/useAxios'
import Modal from '../../../../components/Modal/Modal'
import CustomInput from '../../../../components/CustomInput'
import InviteMember from './InviteMember'
import { OrganizationType } from '../../../../types/types'
import MemberComponent from '../components/MemberComponent'

function OrganizationMembers({organization, size, isAdmin}:{size:number,organization:OrganizationType, isAdmin:boolean}) {
  
    
    const [members, setMembers]=useState<LinguaUser[]>([])
    const [search, setSearch]=useState('')
    const [open, setOpen]=useState(false)
    const [openInvite, setOpenInvite]=useState(false)
    const axios=useAxios()

    useEffect(()=>{
        async function loadMembers(){
            const {data}=await axios.get<LinguaUser[]>(
                'organization/view-members/'+organization.slug,{
                    params:{
                        search:search
                    }
                }
            )
            setMembers(data)
        }
        if(open)loadMembers()
    }, [search, open])

    return (
    <div className='members'>
        ({size}) Member(s)
        <button className='view-btn' onClick={()=>setOpen(true)}>View</button>
        {isAdmin && (<button className='view-btn' onClick={()=>setOpenInvite(true)}>Invite</button>)}
        {open && (
            <Modal onBackdropClick={()=>setOpen(false)}
                title='Members'>
                    <CustomInput placeholder='Search members'
                    onChangeText={(text)=>setSearch(text)}/>
                    <div className="members-result">
                        {members.map((m, index)=>(
                            <MemberComponent user={m} key={index}/>
                        ))}
                    </div>
            </Modal>
        )}
        <InviteMember isOpen={openInvite} onBackdropClick={()=>setOpenInvite(false)}
            organizationId={organization.id!}/>
    </div>
  )
}

export default OrganizationMembers