import React from "react"
import Logo from "@/components/svg/Logo"
import classes from "./Header.module.scss"

const Header:React.FC = () => {
    return <div className = {classes.header}>
        <div className = {classes.header__container}>
            <div className = {classes.header__logo}>
                <Logo />
            </div>
        </div>
    </div>
}

export default Header
