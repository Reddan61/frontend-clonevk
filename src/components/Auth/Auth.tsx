import React from "react"
import classes from "./Auth.module.scss"
import phone1 from "@/images/phone1.png"
import phone2 from "@/images/phone2.png"
import LoginForm from "./LoginForm/LoginForm"
import Register from "./Register/Register"
import withNonAuth from "../HOCs/withNonAuth"
import { AuthApi, ILoginPayload } from "@/Api/auth"
import { LoginSchema } from "./LoginForm/Login.schema"
import { FormikHelpers } from "formik"
import { useNavigate } from "react-router"

const Auth:React.FC = () => {
    const navigate = useNavigate()

    const submit = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        try {
            const validateResult = await LoginSchema.validate(values,{ abortEarly: false })
            
            const payload:ILoginPayload = {
                email:values.email,
                password:values.password
            }

            const response = await AuthApi.login(payload)
            

            if(response.message !== "success") {
                navigate("/auth/login?error=true",{replace:true})
                return
            }

            localStorage.setItem("vk-clone-token",response.payload.token)

            navigate("/profile",{replace:true})
        } catch(e:any) {
            const fieldError = e.inner[0]?.path 
            const messageError = e.inner[0]?.message
            if(fieldError && messageError) 
                setFieldError(fieldError,messageError)
        }
    }

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
                    <LoginForm submit = {submit}/>
                </div>
                <div className = {classes.auth__register}>
                    <Register />
                </div>
            </div>
        </div>
    </div>
}


export default withNonAuth(Auth)