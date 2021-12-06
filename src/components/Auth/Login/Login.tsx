import React from "react"
import { Field, Formik, Form } from "formik"
import Input from "@/components/Formik/Input/Input"
import classes from "./Login.module.scss"

const Login:React.FC = () => {
    const submit = () => {
        console.log("login submit")
    }

    return <Formik
        initialValues = {{email:"",password:""}}
        onSubmit = {submit}
    >
        {() => (
            <Form>
                <Field className = {classes.login__email} name = "email" component = {Input} placeholder = {"Email"}/>
                <Field className = {classes.login__password} name = "password" component = {Input} placeholder = {"Пароль"}/>
                <button className = {classes.login__submit} type = "submit">Войти</button>
            </Form>
        )}
    </Formik>
}


export default Login