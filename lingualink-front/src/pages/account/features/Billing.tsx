import React, { useEffect, useState } from 'react'
import useAxios from '../../../hooks/useAxios'
import { PaymentType } from '../../../types/types'
import PaymentComponent from './components/PaymentComponent'
import '../../../assets/css/billing.css'

function Billing() {
    
    const [payments, setPayments]=useState<PaymentType[]>([])
    const [total, setTotal]=useState<number>()

    const axios=useAxios()

    useEffect(()=>{
        async function fetchPayments(){
            const {data}=await axios.get<{
                data:PaymentType[],
                total:number
            }>(
                "/payments/billing"
            )

            setPayments(data.data)
            setTotal(data.total)
        }
        fetchPayments()
    },[])

  return (
    <div className='billing'>
        <h3 className="account-setting-tittle">Billing</h3>
        <h6 className="total">Total: {total}$</h6>
        <div className="payments">
            <div className="payment-component">
                <span className="bold">Paid on</span>
                <span className="bold">Expire on</span>
                <span className="bold">Amount</span>
            </div>
            {payments.map((m,index)=>(
                <PaymentComponent key={index}
                    payment={m}/>
            ))}
        </div>
    </div>
  )
}

export default Billing