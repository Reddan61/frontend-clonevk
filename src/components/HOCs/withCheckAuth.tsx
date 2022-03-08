import { AuthApi } from "@/Api/auth"
import { loginActions } from "@/store/LoginReducer"
import { useAppDispatch } from "@/store/store"
import React, { ComponentType, useEffect, useState } from "react"

//can be visite independently authorized
const withCheckAuth = <WP,>(WrappedComponent : ComponentType<WP>) => {
    const WithWrapped:React.FC = (props) => {
        const [isLoading,setLoading] = useState(true)
        const dispatch = useAppDispatch()

        useEffect(() => {
            (async function() {
                const response = await AuthApi.me()
                if(response.message === "success") {
                    dispatch(loginActions.loginAC(response.payload._id))
                } else {
                    dispatch(loginActions.logoutAC())
                }
                setLoading(false)
            })()
        },[window.location.href])

        return <WrappedComponent isLoadingHOC={isLoading} {...props as WP}/>
    }

    return WithWrapped
}

export default withCheckAuth