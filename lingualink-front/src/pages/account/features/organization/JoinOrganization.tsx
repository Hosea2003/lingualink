import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAxios from '../../../../hooks/useAxios'

function JoinOrganization() {

    const {slug}=useParams()
    const navigate=useNavigate()
    const axios = useAxios()
    const [message, setMessage]=useState<string|undefined>()

    useEffect(()=>{
        async function joinOrganization(){
            await axios.post(
                '/organization/join-organization/'+slug
            )

            navigate("/account/organization")
        }
        try{
            joinOrganization()
        }
        catch{
            setMessage("error")
        }
    }, [slug])

  return (
    <div>
        HELLO
        {message && (
            <p>Some error occured</p>
        )}
    </div>
  )
}

export default JoinOrganization