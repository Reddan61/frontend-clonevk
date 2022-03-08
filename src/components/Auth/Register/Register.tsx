import React, { useState } from "react"
import { Field, Form, Formik, FormikHelpers } from "formik"
import { useNavigate } from "react-router-dom"
import Input from "@/components/Formik/Input/Input"
import classes from "./Register.module.scss"
import Select from "@/components/Formik/Select/Select"
import { RegisterShema } from "./Register.schema"
import NameErrorMessage from "@/components/Errors/NameError/NameError"
import { AuthApi, IPreRegisterPayload } from "@/Api/auth"
import { useAppDispatch } from "@/store/store"
import { registerActions } from "@/store/RegisterReducer"



const Register:React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    
    const month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    
    const submit = async (values:any,{setFieldError}:FormikHelpers<any>) => {
        try {
            const validateResult = await RegisterShema.validate(values,{ abortEarly: false })

            const payload:IPreRegisterPayload = {
                firstName: values.firstName,
                surname:values.surname,
                birthday: {
                    day:values.day,
                    month:values.month,
                    year:values.year
                }
            }

            setIsLoading(true)
            const response = await AuthApi.preRegister(payload)

            if(response.message !== "success") {
                throw new Error("customError")
            }
            
            dispatch(registerActions.setIdAC(response.payload.user._id))

            navigate("/auth/email")
        } catch(error:any) {
            if(error.message === "customError") {
                alert("Что-то пошло не так!")
                return
            }

            const fieldError = error.inner[0]?.path 
            const messageError = error.inner[0]?.message
 
            setFieldError(fieldError,messageError)
            setIsLoading(false)
        }
    }
    function getDayCount() {
        const arr = []
        for(let i = 0; i < 31; i++) {
            arr.push(i + 1)
        }
        return arr
    }

    function getYears() {
        const startYear = (new Date()).getFullYear() - 119
        const endYear = (new Date()).getFullYear() - 13
        const arr = []

        for(let i = endYear; i > startYear; i--) {
            arr.push(i - 1)
        }
        return arr
    }

    return <Formik
        initialValues = {{firstName:"",surname:"",day:"",month:"",year:""}}
        onSubmit = {submit}
    >
        {({errors, touched}) => (
            <Form>
                <span className = {classes.register__title}>Впервые ВКонтакте?</span>
                <span className = {classes.register__subtitle}>Моментальная регистрация</span>
                <div className = {classes.register__field}>
                    <Field className = {classes.register__firstname} 
                        name = "firstName" component = {Input} placeholder = {"Ваше имя"}
                        isError = {Boolean(errors.firstName && touched.firstName)}
                    />
                    <NameErrorMessage isShow = {Boolean(errors.firstName && touched.firstName)}/>
                </div>
                <div className = {`${classes.register__field} ${classes.register__field_surname}`}>
                    <Field className = {classes.register__surname} name = "surname" component = {Input} placeholder = {"Ваша фамилия"}
                        isError = {Boolean(errors.surname && touched.surname)}
                    />
                    <NameErrorMessage isShow = {Boolean(errors.surname && touched.surname)}/>
                </div>
                <span className = {classes.register__dateInfo}>Дата рождения</span>
                <div className = {classes.register__date}>
                    <Field className = {classes.register__day} name = "day" component = {Select}
                        isError = {Boolean(errors.day && touched.day)}
                    >
                        <option value = "">День</option>
                        {getDayCount().map(el => {
                            return <option value = {el+1} key = {el}>{el}</option>
                        })}
                    </Field>
                    <Field className = {classes.register__month} name = "month" component = {Select}
                        isError = {Boolean(errors.month && touched.month)}
                    >
                        <option value = "">Месяц</option>
                        {month.map((el,index) => {
                            return <option value = {index} key = {el}>{el}</option>
                        })}
                    </Field>
                    <Field className = {classes.register__year} name = "year" component = {Select}
                        isError = {Boolean(errors.year && touched.year)}
                    >
                        <option value = "">Год</option>
                        {getYears().map(el => {
                            return <option value = {el} key = {el}>{el}</option>
                        })}
                    </Field>
                </div>
                <button disabled = {isLoading} className = {classes.register__submit} type = "submit">Продолжить регистрацию</button>
            </Form>
        )}
    </Formik>
}

export default Register