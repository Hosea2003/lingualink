import { LinguaUser } from "./user"

export type Token={
    access:string
    refresh:string
}

export type DecodedToken={
    exp:number
    user_id:number
}

export type BasicResponse={
    message:string
    status:string
}

export interface IAutoCompleteProps{
    displaySelect:string
    value:string | number
}

export type OrganizationType={
    id?:number,
    name:string,
    picture?:string
    slug?:string
    created_at:string
    admin?:LinguaUser
    members?:number
}

export type SocketResponse={
    type:string
}

export type PaymentType={
    expired_on:string
    paid_on:string
    amount:number
}