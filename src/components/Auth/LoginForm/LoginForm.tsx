import React from "react"
import { Field, Formik, Form, FormikHelpers } from "formik"
import Input from "@/components/Formik/Input/Input"
import classes from "./LoginForm.module.scss"
import { LoginSchema } from "./Login.schema"
import { useNavigate } from "react-router"

interface IProps {
    withRegisterButton?:boolean
}


const LoginForm:React.FC<IProps> = ({withRegisterButton}) => {
    const navigate = useNavigate()

    const submit = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        const validateResult = await LoginSchema.validate(values,{ abortEarly: false })
        .catch((err) => {
            return err
        })
        const fieldError = validateResult.inner[0]?.path 
        const messageError = validateResult.inner[0]?.message
        if(fieldError && messageError) 
            setFieldError(fieldError,messageError)

        //При серверной ошибке navigate("auth/login")
    }

    const redirectToRegister = () => {
        navigate("../../auth")
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