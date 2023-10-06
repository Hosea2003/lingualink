import React, { useEffect, useState } from 'react'
import PriceCard from './PriceCard'
import '../../assets/css/pricing.css'
import PriceProvider from '../../hooks/usePriceIntervall'
import ChangePrice from './ChangePrice'
import useAxios from '../../hooks/useAxios'

type PriceType={
    id:string
    unit_amount:number,
}

type ProductType={
    name:string,
    prices:PriceType[]
}

function Pricing() {

    const axios = useAxios()

    const [products, setProducts]=useState<ProductType[]>([])

    useEffect(()=>{
        async function fetchProduct(){
            const {data}=await axios.get<ProductType[]>(
                '/payments/products-list'
            )

            setProducts(data)
        }
        fetchProduct()
    }, [])

  return (
    <div className='pricing'>
        <h1>Compare features</h1>
        <PriceProvider>
            <ChangePrice/>

            <div className="prices">
                {products.map((m, index)=>(
                    <PriceCard key={index}
                    subscription={m.name} 
                    monthly_price={m.prices[1].unit_amount/100} 
                    yearly_price={m.prices[0].unit_amount/100} 
                    services={[]} 
                    year_price_id={m.prices[0].id}
                    month_price_id={m.prices[1].id}/>
                ))}
            </div>
        </PriceProvider>
    </div>
  )
}

export default Pricing