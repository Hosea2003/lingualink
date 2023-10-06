import React, { useEffect, useState } from 'react'
import SuccessMessage from './SuccessMessage'
import CancelMessage from './CancelMessage'

function AfterPaying() {

    const [message, setMessage]=useState("")
    const query = new URLSearchParams(window.location.search)

    useEffect(()=>{
        setMessage(query.get('success')?"success":"cancel")
    },[])

  return (
    <div>
        {message==="success" ?(
            <SuccessMessage 
            session_id={query.get("session_id")!}
            subscription_type={query.get('subscription_type')!}
            amount={+query.get('amount')!}/>
        ):(
            <CancelMessage/>
        )}
    </div>
  )
}

export default AfterPaying