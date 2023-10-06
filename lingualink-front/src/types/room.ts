import { LinguaUser } from "./user"

export type Language={
    code:string,
    name:string
}

export type RoomLanguage={
    id:number,
    language:Language,
    translator:LinguaUser
}

export type Room={
    id?:number,
    name:string,
    description:string,
    host?:LinguaUser,
    type_of:string,
    slug?:string,
    languages?:RoomLanguage[],
    scheduled:string
}

export type LanguageSocket={
    code:string,
    participant:LinguaUser[]
}

export type RoomSocket={
    room_name:string,
    languages:LanguageSocket[]
}