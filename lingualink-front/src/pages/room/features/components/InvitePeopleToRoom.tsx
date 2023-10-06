import React, { useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import CustomInput from '../../../../components/CustomInput'
import { useInvite } from '../hooks/useInvite'
import ChooseUser from '../../../account/features/components/ChooseUser'
import useAxios from '../../../../hooks/useAxios'
import { LinguaUser } from '../../../../types/user'
import { OrganizationType } from '../../../../types/types'
import { API_URI } from '../../../../const/API'

type InvitePeopleToRoomProps={
    onBackdropClick:()=>void
    isOpen:boolean
}

function InvitePeopleToRoom(props:InvitePeopleToRoomProps) {

    const {people, organizations, updateOrganizations, updatePeople}=useInvite()

    const [tempOrganization, setTempOrganization]=useState(organizations)
    const [tempUser, setTempUser]=useState(people)
    const [result, setResult]=useState<{
        users:LinguaUser[],
        organizations:OrganizationType[]
    }>({
        users:[],
        organizations:[]
    })
    const axios = useAxios()


    async function searchUserOrganization(text:string){
        const {data}=await axios.get<{users:LinguaUser[],
        organizations:OrganizationType[]}>(
            '/room/search-user-organization',{
                params:{search:text}
            }
        )
        setResult(data)
    }

    function close(){
        setResult({users:[], organizations:[]})
        props.onBackdropClick()
    }

    function isChecked(id:number, organization=false){
        if(organization){
            return organizations.filter(o=>o.id===id).length>0||
            tempOrganization.filter(o=>o.id===id).length>0
        }

        return people.filter(o=>o.id===id).length>0||
            tempUser.filter(o=>o.id===id).length>0
    }

    function checkOrganization(item:OrganizationType, checked:boolean){
        if(checked){
            setTempOrganization([...tempOrganization, item])
        }
        else setTempOrganization(tempOrganization.filter(o=>o.id!==item.id))
    }

    function checkUser(item:LinguaUser, checked:boolean){
        if(checked){
            setTempUser([...tempUser, item])
        }
        else setTempUser(tempUser.filter(o=>o.id!==item.id))
    }

    function invite(){
        updateOrganizations(tempOrganization)
        updatePeople(tempUser)
        close()
    }

    if(!props.isOpen)return null

  return (
    <Modal title='Invite People to Room' onBackdropClick={close}>
        <CustomInput placeholder='Search user or organization'
        onChangeText={searchUserOrganization}/>
        <div className="result-container" style={{height:300}}>
            {
                result.organizations.length >0 && (
                    <div className="organization-result">
                        <h5 className="title" style={{fontWeight:500}}>Organization</h5>
                        {
                            result.organizations.map((o, index)=>(
                                <ChooseUser display_name={o.name} value={o.id!}
                                checked={isChecked(o.id!, true)} key={index}
                                profile_picture={o.picture?o.picture:
                                require('../../../account/features/assets/images/organization.jpg')}
                                onChecked={(checked)=>checkOrganization(o, checked)}/>
                            ))
                        }
                    </div>
                )
            }
            {
                result.users.length>0 && (
                    <div className="people-result">
                        <h5 className="title" style={{fontWeight:500}}>User</h5>
                        {
                            result.users.map((u, index)=>(
                                <ChooseUser display_name={u.email}
                                value={u.id!} key={index} 
                                profile_picture={u.profile_picture} 
                                checked={isChecked(u.id!, false)}
                                onChecked={(checked)=>checkUser(u, checked)}/>
                            ))
                        }
                    </div>
                )
            }
        </div>
        <div className="invite-actions">
            <button className="invite" onClick={invite}>Invite</button>
      </div>
    </Modal>
  )
}

export default InvitePeopleToRoom