import * as Yup from "yup"

export const EmailSchema = Yup.object().shape({
    email: Yup.string()
    .email("Введите Email!")
    .required("Необходимое поле!")
})

export const CodeSchema = Yup.object().shape({
    code: Yup.string()
    .max(4)
    .min(4)
})
export const PasswordSchema = Yup.object().shape({
    password: Yup.string()
    .min(6, "Не менее 6 символов в длину")
})