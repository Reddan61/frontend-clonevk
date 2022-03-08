import React, { useEffect } from "react"
import { Field, Formik, Form, FormikHelpers } from "formik"
import Input from "@/components/Formik/Input/Input"
import classes from "./LoginForm.module.scss"
import { LoginSchema } from "./Login.schema"
import { useNavigate, useParams } from "react-router"
import { AuthApi, ILoginPayload } from "@/Api/auth"
import { useSearchParams } from "react-router-dom"

interface IProps {
    withRegisterButton?:boolean,
    setError?: (bool:boolean) => void,
    isLoading?:boolean,
    submit: (values:any,{}:FormikHelpers<any>) => void
}


const LoginForm:React.FC<IProps> = ({withRegisterButton, setError, submit, isLoading}) => {
    const navigate = useNavigate()
    const  [query,setQuery] = useSearchParams()
  
    useEffect(() => {
        if(query.get("error") && setError) {
            setError(true)
        }
    },[])

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
                    <button disabled = {isLoading} className = {classes.login__submit} type = "submit">Войти</button>
                    {
                        withRegisterButton &&
                        <button disabled = {isLoading} type="button" onClick={redirectToRegister}  className = {classes.login__register}>Регистрация</button>
                    }
                </div>
            </Form>
        )}
    </Formik>
}


export default LoginForm