import { AuthApi } from "@/Api/auth"
import React, { ComponentType, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"


const withAuth = <WP,>(WrappedComponent : ComponentType<WP>) => {
    const WithWrapped:React.FC = (props) => {
        const [isLoading,setLoading] = useState(true)
        const [isAuth,setAuth] = useState(false)

        useEffect(() => {
            (async function() {
                const response = await AuthApi.me()
                if(response.message === "success") {
                    setAuth(true)
                }
                setLoading(false)
            })()
        },[])

        if(isLoading) 
            return <div>Loading...</div>

        if(!isAuth) {
            return <Navigate to={"/auth"} />
        }

        return <WrappedComponent {...props as WP}/>
    }

    return WithWrapped
}

export default withAuth