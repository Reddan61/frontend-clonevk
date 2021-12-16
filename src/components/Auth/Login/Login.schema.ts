import * as Yup from "yup"

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
    .email("Введите Email!")
    .required("Необходимое поле!"),
    password: Yup.string()
    .min(2,"Пароль слишком короткий!")
    .required("Необходимое поле!")
})