import React from 'react'
import { PaymentType } from '../../../../types/types'

function PaymentComponent({payment}:{payment:PaymentType}) {
  return (
    <div className='payment-component'>
        <span>{new Date(payment.paid_on).toDateString()}</span>
        <span>{new Date(payment.expired_on).toDateString()}</span>
        <span>{payment.amount}$</span>
    </div>
  )
}

export default PaymentComponent