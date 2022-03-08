import React, { useState } from "react"
import { useNavigate } from "react-router"
import { FormikHelpers } from "formik"
import withNonAuth from "@/components/HOCs/withNonAuth"
import LoginForm from "../LoginForm/LoginForm"
import classes from "./Login.module.scss"
import { LoginSchema } from "../LoginForm/Login.schema"
import { AuthApi, ILoginPayload } from "@/Api/auth"
import { useAppDispatch } from "@/store/store"
import { loginActions } from "@/store/LoginReducer"

const Login:React.FC = () => {
    const [isError,setError] = useState(false)
    const [isLoading,setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const submit = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        try {
            const validateResult = await LoginSchema.validate(values,{ abortEarly: false })
            
            const payload:ILoginPayload = {
                email:values.email,
                password:values.password
            }
            setLoading(true)
            const response = await AuthApi.login(payload)
            

            if(response.message !== "success") {
                if(setError) {
                    setError(true)
                }
                return
            }

            localStorage.setItem("vk-clone-token",response.payload.token)
            
            navigate("/profile",{replace:true})
        } catch(e:any) {
            const fieldError = e.inner[0]?.path 
            const messageError = e.inner[0]?.message
            setLoading(false)
            if(fieldError && messageError) 
                setFieldError(fieldError,messageError)
        }
    }

    return <div className={classes.login}>
        <div className={classes.login__wrapped}>
            <div className={classes.login__title}>
                Вход ВКонтакте
            </div>
            {
                isError && 
                <div className={classes.login__error}>
                    <b>Не удаётся войти.</b><br />
                    Пожалуйста, проверьте правильность написания <b>логина</b> и <b>пароля</b>. 
                    <ul>
                        <li>Возможно, нажата клавиша <b>Caps Lock</b>?</li>
                        <li>Может быть, у Вас включена неправильная <b>раскладка</b>? (русская или английская)</li>
                        <li>Попробуйте набрать свой пароль в текстовом редакторе и <b>скопировать</b> в графу «Пароль»</li>
                    </ul>
                </div>
            }
            <div className={classes.login__form}>
                <LoginForm isLoading = {isLoading} submit={submit} withRegisterButton = {true} setError={setError}/>
            </div>
        </div>
    </div>
}


export default withNonAuth(Login)