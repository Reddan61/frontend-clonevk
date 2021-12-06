import { FieldProps } from "formik"
import React from "react"
import classes from "./Select.module.scss"

interface IProps {
    className:string
}

const Select:React.FC<FieldProps<any> & IProps> = ({
    field,
    form: {touched,errors},
    className,
    children,
    ...props
}) => {
    return <div className = {`${className} ${classes.select}`}>
        <select required {...field} {...props}>
            {children}
        </select>
    </div>
}


export default Select