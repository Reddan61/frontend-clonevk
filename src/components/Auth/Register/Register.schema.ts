import * as Yup from "yup"

export const RegisterShema = Yup.object().shape({
    firstName: Yup.string()
    .min(2,"Имя слишком короткое!")
    .required("Необходимое поле!"),
    surname: Yup.string()
    .min(2,"Имя слишком короткое!")
    .required("Необходимое поле!"),
    day: Yup.string()
    .required("Необходимое поле!"),
    month: Yup.string()
    .required("Необходимое поле!"),
    year: Yup.string()
    .required("Необходимое поле!")
})