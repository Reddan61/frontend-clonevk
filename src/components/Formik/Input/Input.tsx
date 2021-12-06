import React from "react"
import { FieldProps } from "formik"
import classes from "./Input.module.scss"

interface IProps {
    className:string
}

const Input:React.FC<FieldProps<any> & IProps> = ({
    field,
    form: {touched,errors},
    className,
    ...props
}) => {
    return <div className = {`${classes.input} ${className}`}>
        <input type = "text" {...field} {...props} />
    </div>
}

export default Input