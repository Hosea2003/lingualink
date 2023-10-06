import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../../hooks/useAxios'
import { ClipLoader } from 'react-spinners'

function SuccessMessage({session_id, subscription_type, amount}:{session_id:string, subscription_type:string, amount:number}) {
  
    const axios = useAxios()
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        async function registerPayment(){
            await axios.post(
                '/payments/successfull-payment',{
                    session_id:session_id,
                    subscription_type:subscription_type,
                    amount:amount
                }
            )
            setLoading(false)
        }
        registerPayment()
    }, [])
  
    return (
    <div className='payment-success'>
        {loading?(
            <ClipLoader
            loading={loading}
            color='#0367c5'
            size={70}
            aria-label='Saving your subscription'/>
        ):(
            <div className="wrapped">
                <span>Your payements has been successfull</span>
                <Link className="back-to-home" to={'/account/billing'}>View payments</Link>
            </div>
        )}
    </div>
  )
}

export default SuccessMessage