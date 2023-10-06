import React, {createContext, useState, useContext} from 'react'

type PriceProps={
  intervall:string,
  setIntervall?:(new_value:string)=>void
}

const defaultValue:PriceProps={
  intervall:"monthly"
}

const PriceIntervallContext=createContext<PriceProps>(defaultValue)

function PriceProvider({children}:any) {

  const [intervall, setIntervall]=useState<string>(defaultValue.intervall)

  return (
    <PriceIntervallContext.Provider value={{intervall, setIntervall}}>
      {children}
    </PriceIntervallContext.Provider>
  )
}

export default PriceProvider

export function usePriceIntervall(){
  return useContext(PriceIntervallContext)
}