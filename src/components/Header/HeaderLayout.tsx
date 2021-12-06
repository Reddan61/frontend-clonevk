import React from "react"
import Header from "./Header"


const HeaderLayout:React.FC = ({children}) => {
    return <>
        <Header />
        <div>
            {children}
        </div>
    </>
}

export default HeaderLayout
