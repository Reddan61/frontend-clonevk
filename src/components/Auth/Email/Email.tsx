import Input from "@/components/Formik/Input/Input"
import Key from "@/components/svg/Key"
import LogoID from "@/components/svg/LogoID"
import Phone from "@/components/svg/Phone"
import Profile from "@/components/svg/Profile"
import Error from "@/components/svg/Error"
import { Field, Form, Formik, FormikHelpers } from "formik"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import classes from "./Email.module.scss"
import { CodeSchema, EmailSchema, PasswordSchema } from "./Email.schema"
import { AuthApi, ISendEmailPayload, ISetPasswordPayload, IVerifyEmailPayload } from "@/Api/auth"
import { useAppDispatch, useAppSelector } from "@/store/store"
import withRegisterId from "@/components/HOCs/withRegisterId"
import { registerActions } from "@/store/RegisterReducer"
import withNonAuth from "@/components/HOCs/withNonAuth"

const Email:React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [submitedEmail,setSubmitEmail] = useState(false)
    const [submitedCode,setSubmitCode] = useState(false)
    const [emailError,setEmailError] = useState(false)

    const [ isLoading, setLoading ] = useState(false)

    const registeredId = useAppSelector(state => state.register._id)

    const firstForm = useRef<any>()
    const secondForm = useRef<any>()
    const thirdForm = useRef<any>()

    const sendEmail = async (values:any) => {
        try {
            const validateResult = await EmailSchema.validate(values,{ abortEarly: false })
            const payload:ISendEmailPayload = {
                _id:registeredId || "",
                email:values.email
            }
            setLoading(true)
            const response = await AuthApi.sendEmail(payload)
            setLoading(false)
            if(response.message === "success") {
                setSubmitEmail(true)
                return
            }
            await EmailSchema.validate({error:"error"})
        } catch(validationError:any) {
            setEmailError(true)
        }
    }
    const sendCode = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        try {
            const validateResult = await CodeSchema.validate(values,{ abortEarly: false })
            const payload:IVerifyEmailPayload = {
                _id:registeredId,
                code:values.code
            }

            setLoading(true)
            const response = await AuthApi.verifyEmail(payload)
            setLoading(false)

            if(response.message === "success") {
                setSubmitCode(true)
                return
            }
            //throw error
            await CodeSchema.validate({code:"1"},{ abortEarly: false })

        } catch(validationError:any) {
            const fieldError = validationError.inner[0]?.path 
            const messageError = validationError.inner[0]?.message
            
            setFieldError(fieldError,messageError)
        }
    }
    const sendPassword = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        const payload:ISetPasswordPayload = {
            _id:registeredId || "",
            password:values.password
        }

        setLoading(true)
        const response = await AuthApi.setPassword(payload)
        setLoading(false)

        if(response.message === "success") {
            navigate("/auth/login",{replace:true})
            dispatch(registerActions.setIdAC(null))
        }
    }

    function clickSubmitButton(e:any) {
        e.preventDefault()
        if(!submitedEmail) {
            firstForm.current.handleSubmit()
        } else if(submitedCode) {
            thirdForm.current.handleSubmit()
        } else {
            secondForm.current.handleSubmit()
        }
    }

    return <div className = {classes.email}>
        <div className = {classes.email__container}>
            <div className = {`${classes.email__block} ${classes.email__left} ${classes.left}`}>
                <LogoID />
                <h2 className = {classes.left__title}>
                    ???????????? ?????????????????? ?????? ?????????????????????? ???? ?????????????????? ????????????????
                </h2>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Profile width={24} height={24} color="#6F7985"/>
                    </div>
                    <div className = {classes.card__text}>
                        ???????????????? ?????????????? ?????????????????? ?? ?????????????????????? ?????? ?????? ?????????? ?? ???????????? ??????????????
                    </div>
                </div>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Key />
                    </div>
                    <div className = {classes.card__text}>
                        ???????? ???????????? ?????? ??????????????: ?????????????????? ?????????????????????????? ?????????? ?? ?????????????? ???? ???????????????? ????????????????????
                    </div>
                </div>
                <div className = {classes.card}>
                    <div className = {classes.card__svg}>
                        <Phone />
                    </div>
                    <div className = {classes.card__text}>
                        ??????????????, ?????????????? ?????? ?????????????????? ??? VK ID ???????????????? ?????? ????????????
                    </div>
                </div>
            </div>
            <div className = {`${classes.email__block} ${classes.email__right} ${classes.right}`}>
                <h2 className = {classes.right__title}>
                    ?????????????????????????? ??????????????????????
                </h2>
                <div className = {classes.right__subTitle}>
                    ?????? ?????????? ?????????????????????? ??????????  ??????????
                    ???????????????????????????? ?????? ?????????? ?? ??????????????
                </div>
                {emailError && <div className={classes.error}>
                    <div className={classes.error__wrapped}>
                        <Error />
                        <div className={classes.error__text}>
                            <b>???????????????? ?????????? ??????????.</b>
                            <br />
                            ????????????: Test@ya.ru
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
                                <div className = {classes.form__text}>?????????? ?????????????????????? ??????????</div>
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
                                    <div className = {classes.form__text}>?????????????????????????? ???????????? ??????????</div>
                                    <Field className = {classes.form__code} name = "code" 
                                        component = {Input} placeholder = {"?????? ???? ????????????"}
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
                                    <div className = {classes.form__text}>????????????</div>
                                    <Field className = {classes.form__password} name = "password" 
                                        component = {Input} placeholder = {"?????????????? ????????????"}
                                        isError = {Boolean(errors.password && touched.password)}
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
                    <button disabled={isLoading} type="submit" onClick = {clickSubmitButton}>??????????</button>
                </div>
            </div>
        </div>
    </div>
}



export default withNonAuth(withRegisterId(Email))