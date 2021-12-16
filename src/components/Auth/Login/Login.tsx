import React from "react"
import { Field, Formik, Form, FormikHelpers } from "formik"
import Input from "@/components/Formik/Input/Input"
import classes from "./Login.module.scss"
import { LoginSchema } from "./Login.schema"

const Login:React.FC = () => {
    const submit = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        const validateResult = await LoginSchema.validate(values,{ abortEarly: false })
        .catch((err) => {
            return err
        })
        const fieldError = validateResult.inner[0]?.path 
        const messageError = validateResult.inner[0]?.message
        if(fieldError && messageError) 
            setFieldError(fieldError,messageError)
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
                <button className = {classes.login__submit} type = "submit">Войти</button>
            </Form>
        )}
    </Formik>
}


export default Login