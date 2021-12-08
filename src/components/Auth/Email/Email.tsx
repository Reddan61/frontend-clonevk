import Button from "@/components/Formik/Button/Button"
import Input from "@/components/Formik/Input/Input"
import Key from "@/components/svg/Key"
import LogoID from "@/components/svg/LogoID"
import Phone from "@/components/svg/Phone"
import Profile from "@/components/svg/Profile"
import { Field, Form, Formik } from "formik"
import React, { useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import classes from "./Email.module.scss"

const Email:React.FC = () => {
    const isRegistered = true
    const [isSubmittedFirst,setSubmittedFirst] = useState(false)
    const firstForm = useRef<any>()
    const secondForm = useRef<any>()

    const sendEmail = () => {
        console.log("send email")
        setSubmittedFirst(true)
    }
    const sendCode = () => {
        console.log("send code")
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
                <div className = {classes.right__forms}>
                    <Formik
                        innerRef = {firstForm}
                        initialValues = {{email:""}}
                        onSubmit = {sendEmail}
                    >
                        {() => (
                            <Form>
                                <div className = {classes.form__text}>Адрес электронной почты</div>
                                <Field className = {classes.form__email} name = "email" component = {Input} placeholder = {"Ваша фамилия"}/>
                            </Form>
                        )}
                    </Formik>
                    <Formik
                        innerRef = {secondForm}
                        initialValues = {{code:""}}
                        onSubmit = {sendCode}
                    >
                        {() => (
                            <Form>
                                {isSubmittedFirst && <>
                                    <div className = {classes.form__text}>Подтверждение адреса почты</div>
                                    <Field className = {classes.form__code} name = "code" component = {Input} placeholder = {"Код из письма"}/>
                                </>}
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className = {classes.email__next}>
                    <button onClick = {() => {
                        if(!isSubmittedFirst) {
                            firstForm.current.handleSubmit()
                        } else {
                            secondForm.current.handleSubmit()
                        }
                    }}>Далее</button>
                </div>
            </div>
        </div>
    </div>
}


export default Email