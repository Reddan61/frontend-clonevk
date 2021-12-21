import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"


const HeaderLayout:React.FC = () => {
    return <>
        <Header />
        <div style={{
            minHeight: "calc(100vh - 46px)"
        }}>
            <Outlet />
        </div>
    </>
}

export default HeaderLayout
