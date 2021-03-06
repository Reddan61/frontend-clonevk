import { AuthApi } from "@/Api/auth"
import { loginActions } from "@/store/LoginReducer"
import { useAppDispatch, useAppSelector } from "@/store/store"
import React, { ComponentType, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

//can be visite without authentication
const withNonAuth = <WP,>(WrappedComponent : ComponentType<WP>) => {
    const WithWrapped:React.FC = (props) => {
        const [isLoading,setLoading] = useState(true)
        const { isAuth } = useAppSelector(state => state.login)

        const dispatch = useAppDispatch()
        
        useEffect(() => {
            (async function() {
                const response = await AuthApi.me()
                if(response.message === "success") {
                    dispatch(loginActions.loginAC(response.payload._id))
                }
                setLoading(false)
            })()
        },[window.location.href])

        if(isLoading) 
            return <div></div>

        if(isAuth) {
            return <Navigate to={"/profile"} />
        }
        
        return <WrappedComponent {...props as WP}/>
    }

    return WithWrapped
}

export default withNonAuth