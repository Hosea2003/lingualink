import React, { createContext, useContext, useState } from 'react'
import { Language } from '../../../../types/room'

type LanguageTranslator={
    language?:string
    translator_id?:number
}

type LanguageContextProps={
    languages:LanguageTranslator[],
    updateLanguages:(new_source:LanguageTranslator[])=>void
}

const LanguageContext=createContext<LanguageContextProps>({
    languages:[],
    updateLanguages:()=>{}
})

function LanguageProvider({children}:{children?:React.ReactNode}) {

    const [languages, setLanguages]=useState<LanguageTranslator[]>([])

  return (
    <LanguageContext.Provider value={{
        languages:languages,
        updateLanguages:(new_value:LanguageTranslator[])=>setLanguages(new_value)
    }}>
        {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider

export function useLanguage(){
    return useContext(LanguageContext)
}