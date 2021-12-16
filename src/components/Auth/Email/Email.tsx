import Input from "@/components/Formik/Input/Input"
import Key from "@/components/svg/Key"
import LogoID from "@/components/svg/LogoID"
import Phone from "@/components/svg/Phone"
import Profile from "@/components/svg/Profile"
import Error from "@/components/svg/Error"
import { Field, Form, Formik, FormikHelpers } from "formik"
import React, { useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import classes from "./Email.module.scss"
import { CodeSchema, EmailSchema, PasswordSchema } from "./Email.schema"

const Email:React.FC = () => {
    const isRegistered = true
    const [submitedEmail,setSubmitEmail] = useState(false)
    const [submitedCode,setSubmitCode] = useState(false)
    const [emailError,setEmailError] = useState(false)
    const firstForm = useRef<any>()
    const secondForm = useRef<any>()
    const thirdForm = useRef<any>()

    const sendEmail = async (values:any) => {
        try {
            const validateResult = await EmailSchema.validate(values,{ abortEarly: false })

            setSubmitEmail(true)
        } catch(validationError:any) {
            setEmailError(true)
        }
    }
    const sendCode = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        try {
            const validateResult = await CodeSchema.validate(values,{ abortEarly: false })

            setSubmitCode(true)
        } catch(validationError:any) {
            const fieldError = validationError.inner[0]?.path 
            const messageError = validationError.inner[0]?.message
 
            setFieldError(fieldError,messageError)
        }
    }
    const sendPassword = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        console.log("everything submitted")
    }

    if(!isRegistered)
        return <Navigate to = "/auth"></Navigate>
    return <div className = {classes.email}>
        <div className = {classes.email__container}>
            <div className = {`${classes.email__block} ${classes.email__left} ${classes.left}`}>
                <LogoID />
                <h2 className = {classes.left__title}>
                    Единая платформа для авторизации во множестве сервисов
                </h2>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Profile />
                    </div>
                    <div className = {classes.card__text}>
                        Создайте аккаунт ВКонтакте и используйте его для входа в другие сервисы
                    </div>
                </div>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Key />
                    </div>
                    <div className = {classes.card__text}>
                        Ваши данные под защитой: настройте подтверждение входа и следите за историей активности
                    </div>
                </div>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Phone />
                    </div>
                    <div className = {classes.card__text}>
                        Неважно, телефон или компьютер — VK ID работает где угодно
                    </div>
                </div>
            </div>
            <div className = {`${classes.email__block} ${classes.email__right} ${classes.right}`}>
                <h2 className = {classes.right__title}>
                    Подтверждение регистрации
                </h2>
                <div className = {classes.right__subTitle}>
                    Ваш адрес электронной почты  будет
                    использоваться для входа в аккаунт
                </div>
                {emailError && <div className={classes.error}>
                    <div className={classes.error__wrapped}>
                        <Error />
                        <div className={classes.error__text}>
                            <b>Неверный адрес почты.</b>
                            <br />
                            Пример: Test@ya.ru
                        </div>
                    </div>
                </div>}
                <div className = {classes.right__forms}>
                    <Formik
                        innerRef = {firstForm}
                        initialValues = {{email:""}}
                        onSubmit = {sendEmail}
                    >
                        {({errors,touched}) => (
                            <Form>
                                <div className = {classes.form__text}>Адрес электронной почты</div>
                                <Field className = {classes.form__email} name = "email" component = {Input} placeholder = {"Email"} disabled = {submitedEmail}/>
                            </Form>
                        )}
                    </Formik>
                    <Formik
                        innerRef = {secondForm}
                        initialValues = {{code:""}}
                        onSubmit = {sendCode}
                    >
                        {({errors,touched}) => (
                            <Form>
                                {submitedEmail && <>
                                    <div className = {classes.form__text}>Подтверждение адреса почты</div>
                                    <Field className = {classes.form__code} name = "code" 
                                        component = {Input} placeholder = {"Код из письма"}
                                        isError = {Boolean(errors.code && touched.code)}
                                        disabled = {submitedCode}
                                    />
                                </>}
                            </Form>
                        )}
                    </Formik>
                    <Formik
                        innerRef = {thirdForm}
                        initialValues = {{password:""}}
                        onSubmit = {sendPassword}
                        validationSchema={PasswordSchema}
                    >
                        {({errors,touched}) => (
                            <Form>
                                {submitedCode && <>
                                    <div className = {classes.form__text}>Подтверждение адреса почты</div>
                                    <Field className = {classes.form__password} name = "password" 
                                        component = {Input} placeholder = {"Введите пароль"}
                                    />
                                    {Boolean(errors.password) &&
                                        <div className={classes.form__error}>{errors.password}</div>
                                    }
                                </>}
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className = {classes.email__next}>
                    <button type="submit" onClick = {(e) => {
                        e.preventDefault()
                        if(!submitedEmail) {
                            firstForm.current.handleSubmit()
                        } else if(submitedCode) {
                            thirdForm.current.handleSubmit()
                        } else {
                            secondForm.current.handleSubmit()
                        }
                    }}>{submitedCode ? "Войти на сайт" :"Далее"}</button>
                </div>
            </div>
        </div>
    </div>
}


export default Email