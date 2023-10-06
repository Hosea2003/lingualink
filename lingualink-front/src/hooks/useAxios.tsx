import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import axios from 'axios'
import { API_URI } from "../const/API";
import { Token } from "../types/types";

export default function useAxios(){
    const {token, accessTokenValid, refreshTokenValid, saveToken}=useAuth()

    const navigate=useNavigate()

    const axiosInstance = axios.create({
        baseURL:API_URI,
        headers:{
            'Authorization':'Bearer '+token?.access
        }
    })

    axiosInstance.interceptors.request.use(
        async (request)=>{

            if(!accessTokenValid()){
                if(!refreshTokenValid()){
                    navigate('/login')
                    return request
                }

                const {data} = await axios.post<Token>(
                    `${API_URI}/user/refresh-token/`,{
                        refresh:token?.refresh
                    }
                )
                request.headers.Authorization=`Bearer ${data.access}`
                saveToken(data)
            }

            return request
        }
    )
    return axiosInstance
}