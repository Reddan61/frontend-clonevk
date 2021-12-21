import { FieldProps } from "formik"
import React, { useEffect, useRef, useState } from "react"
import classes from "./Select.module.scss"

interface IProps {
    className:string,
    isError:boolean
}

const Select:React.FC<FieldProps<any> & IProps> = ({
    field,
    isError,
    form: {touched,errors},
    className,
    children,
    ...props
}) => {
    const isAnimationEndRef = useRef(true)
    return <div className = {`${className} ${classes.select} ${!field.value && classes.select_null}`}>
        <ErrorDiv error = {isError} isAnimationEndRef = {isAnimationEndRef}/>
        <select {...field} {...props}>
            {children}
        </select>
    </div>
}

interface IErrorDivProps {
    error:boolean,
    isAnimationEndRef:{current:boolean}
}

const ErrorDiv:React.FC<IErrorDivProps> = React.memo(({error,isAnimationEndRef}) => {
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(error && isAnimationEndRef.current) {
            divRef.current!.classList.add(classes.select__error_active)
        }
    },[error])

    return <div
    ref = {divRef}
    onAnimationStart={() => {
        isAnimationEndRef.current = false
    }} onAnimationEnd={() => {
        isAnimationEndRef.current = true
        divRef.current!.classList.remove(classes.select__error_active)
    }} className={`${classes.select__error}`}></div>
  
},(prev,next) => {
    if(prev.error !== next.error && next.isAnimationEndRef.current) 
        return false
    return true
})


export default React.memo(Select)