import { AuthApi } from "@/Api/auth"
import { loginActions } from "@/store/LoginReducer"
import { useAppDispatch, useAppSelector } from "@/store/store"
import React, { ComponentType, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

//can be visite with authentication
const withAuth = <WP,>(WrappedComponent : ComponentType<WP>) => {
    const WithWrapped:React.FC = (props) => {
        const [isLoading,setLoading] = useState(true)
        const { isAuth } = useAppSelector(state => state.login)

        const dispatch = useAppDispatch()

        useEffect(() => {
            let isMounted = true;
            (async function() {
                const response = await AuthApi.me()
                if(response.message === "success" && isMounted) {
                    dispatch(loginActions.loginAC(response.payload._id))
                    setLoading(false)
                }
            })()
            return () => {
                isMounted = false
            }
        },[window.location.href])

        if(!isAuth) {
            return <Navigate to={"/auth"} />
        }

        return <WrappedComponent isLoadingHOC = {isLoading} {...props as WP}/>
    }

    return WithWrapped
}

export default withAuth