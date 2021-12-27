import React from "react"
import { Field, Formik, Form, FormikHelpers } from "formik"
import Input from "@/components/Formik/Input/Input"
import classes from "./LoginForm.module.scss"
import { LoginSchema } from "./Login.schema"
import { useNavigate } from "react-router"
import { AuthApi, ILoginPayload } from "@/Api/auth"

interface IProps {
    withRegisterButton?:boolean,
    setError?: (bool:boolean) => void
}


const LoginForm:React.FC<IProps> = ({withRegisterButton, setError}) => {
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
            if(fieldError && messageError) 
                setFieldError(fieldError,messageError)
        }
    }

    const redirectToRegister = () => {
        navigate("/auth",{replace:true})
    }

    return <Formik
        initialValues = {{email:"",password:""}}
        onSubmit = {submit}
    >
        {({errors, touched}) => (
            <Form>
                <Field className = {classes.login__email} name = "email"
                    component = {Input} placeholder = {"Email"}
                    isError = {Boolean(errors.email && touched.email)}
                />
                <Field className = {classes.login__password} name = "password" 
                    component = {Input} placeholder = {"Пароль"}
                    type = {"password"}
                    isError = {Boolean(errors.password && touched.password)}
                />
                <div  className = {classes.login__buttons}>
                    <button className = {classes.login__submit} type = "submit">Войти</button>
                    {
                        withRegisterButton &&
                        <button type="button" onClick={redirectToRegister}  className = {classes.login__register}>Регистрация</button>
                    }
                </div>
            </Form>
        )}
    </Formik>
}


export default LoginForm