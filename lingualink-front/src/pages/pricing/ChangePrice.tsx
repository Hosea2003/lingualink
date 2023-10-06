import React from 'react'
import Choice from '../../components/Choice'
import Choices from '../../components/Choices'
import { usePriceIntervall } from '../../hooks/usePriceIntervall'

function ChangePrice() {

    const {setIntervall}=usePriceIntervall()



  return (
    <div className="intervall">
                How often would you like to be billed?
                <Choices onChange={(value)=>setIntervall && setIntervall(value)}>
                    <Choice text='Monthly' value='monthly'/>
                    <Choice text='Yearly' value='yearly'/>
                </Choices>
            </div>
  )
}

export default ChangePrice