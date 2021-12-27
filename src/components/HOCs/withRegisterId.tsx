import { useAppSelector } from "@/store/store"
import React, { ComponentType } from "react"
import { Navigate } from "react-router-dom"


const withRegisterId = <WP,>(WrappedComponent : ComponentType<WP>) => {
    const WithWrapped:React.FC = (props) => {
        const registerId = useAppSelector(state => state.register._id)
        
        if(!registerId) {
            return <Navigate to={"/auth"} />
        }

        return <WrappedComponent {...props as WP}/>
    }

    return WithWrapped
}

export default withRegisterId