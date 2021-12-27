import React, { useState } from "react"
import withNonAuth from "@/components/HOCs/withNonAuth"
import LoginForm from "../LoginForm/LoginForm"
import classes from "./Login.module.scss"

const Login:React.FC = () => {
    const [isError,setError] = useState(false)

    return <div className={classes.login}>
        <div className={classes.login__wrapped}>
            <div className={classes.login__title}>
                Вход ВКонтакте
            </div>
            {
                isError && 
                <div className={classes.login__error}>
                    <b>Не удаётся войти.</b><br />
                    Пожалуйста, проверьте правильность написания <b>логина</b> и <b>пароля</b>. 
                    <ul>
                        <li>Возможно, нажата клавиша <b>Caps Lock</b>?</li>
                        <li>Может быть, у Вас включена неправильная <b>раскладка</b>? (русская или английская)</li>
                        <li>Попробуйте набрать свой пароль в текстовом редакторе и <b>скопировать</b> в графу «Пароль»</li>
                    </ul>
                </div>
            }
            <div className={classes.login__form}>
                <LoginForm withRegisterButton = {true} setError={setError}/>
            </div>
        </div>
    </div>
}


export default withNonAuth(Login)