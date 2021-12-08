import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"


const HeaderLayout:React.FC = () => {
    return <>
        <Header />
        <div>
            <Outlet />
        </div>
    </>
}

export default HeaderLayout
