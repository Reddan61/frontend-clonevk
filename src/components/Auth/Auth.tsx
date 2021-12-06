import React from "react"
import classes from "./Auth.module.scss"
import phone1 from "@/images/phone1.png"
import phone2 from "@/images/phone2.png"
import Login from "./Login/Login"
import Register from "./Register/Register"

const Auth:React.FC = () => {
    return <div className = {classes.auth}>
        <div className = {classes.auth__container}>
            <div className = {classes.auth__left}>
                <div className = {classes.auth__title}>ВКонтакте для мобильных устройств</div>
                <div className = {classes.auth__subtitle}>
                    Установите официальное мобильное приложение ВКонтакте и оставайтесь в курсе новостей ваших друзей, где бы вы ни находились.
                </div>
                <div className = {classes.auth__images}>
                    <img className = {classes.auth__phone_1} src = {phone1} />
                    <img className = {classes.auth__phone_2} src = {phone2} />
                </div>
            </div>
            <div className = {classes.auth__right}>
                <div className = {classes.auth__login}>
                    <Login />
                </div>
                <div className = {classes.auth__register}>
                    <Register />
                </div>
            </div>
        </div>
    </div>
}


export default Auth