import React from "react"
import Input from "@/components/Formik/Input/Input"
import { Field, Form, Formik } from "formik"
import classes from "./Register.module.scss"
import Select from "@/components/Formik/Select/Select"



const Register:React.FC = () => {
    const month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    const submit = () => {
        console.log("register submit")
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
        {() => (
            <Form>
                <span className = {classes.register__title}>Впервые ВКонтакте?</span>
                <span className = {classes.register__subtitle}>Моментальная регистрация</span>
                <Field className = {classes.register__firstname} name = "firstName" component = {Input} placeholder = {"Ваше имя"}/>
                <Field className = {classes.register__surname} name = "surname" component = {Input} placeholder = {"Ваша фамилия"}/>
                <span className = {classes.register__dateInfo}>Дата рождения</span>
                <div className = {classes.register__date}>
                    <Field className = {classes.register__day} name = "day" component = {Select}>
                        <option value = "">День</option>
                        {getDayCount().map(el => {
                            return <option value = {el+1} key = {el}>{el}</option>
                        })}
                    </Field>
                    <Field className = {classes.register__month} name = "month" component = {Select}>
                        <option value = "">Месяц</option>
                        {month.map(el => {
                            return <option value = {el} key = {el}>{el}</option>
                        })}
                    </Field>
                    <Field className = {classes.register__year} name = "year" component = {Select}>
                        <option value = "">Год</option>
                        {getYears().map(el => {
                            return <option value = {el} key = {el}>{el}</option>
                        })}
                    </Field>
                </div>
                <button className = {classes.register__submit} type = "submit">Продолжить регистрацию</button>
            </Form>
        )}
    </Formik>
}

export default Register