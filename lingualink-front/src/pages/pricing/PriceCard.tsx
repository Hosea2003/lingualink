import React from 'react'
import '../../assets/css/price.css'
import done from '../../assets/images/check.png'
import { usePriceIntervall } from '../../hooks/usePriceIntervall'
import useAxios from '../../hooks/useAxios'
import { toast } from 'react-toastify'

type PriceCardProps={
    subscription:string
    monthly_price:number
    yearly_price:number
    services:string[]
    month_price_id:string,
    year_price_id:string
}

function PriceCard(props:PriceCardProps) {
    const {intervall}=usePriceIntervall()
    const isMonthly=intervall==="monthly"
    const axios = useAxios()

    function create_checkout_session(){
        toast.promise(getUrlCheckout,{
            success:"redirecting to stripe",
            pending:"Wait until we make everything work",
            error:"There was an error"
        })
    }

    async function getUrlCheckout(){
        const {data}= await axios.post(
            '/payments/create-checkout-session',{
                price_id:isMonthly?props.month_price_id:props.year_price_id,
                subscription_type:intervall,
                amount:isMonthly?props.monthly_price:props.yearly_price
            }
        )

        window.location.href=data
    }

  return (
    <div className='price'>
        <div className="head">
            <span className='subscription'>{props.subscription}</span>
            <span className='price-value'>
                {isMonthly ?props.monthly_price:props.yearly_price}
                $
            </span>
        </div>
        <div className="service">
            <button className='buy-btn' onClick={create_checkout_session}>Buy</button>
            {props.services.map((service, index)=>(
                <span key={index} className='service-item'><img src={done} alt="" />{service}</span>
            ))}
        </div>
    </div>
  )
}

export default PriceCard