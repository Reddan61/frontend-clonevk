import React, { useEffect, useRef, useState } from "react"
import { FieldProps } from "formik"
import classes from "./Input.module.scss"

interface IProps {
    className:string,
    isError:boolean,
    disabled:boolean,
}

const Input:React.FC<FieldProps<any> & IProps> = ({
    field,
    isError,
    form: {touched,errors},
    disabled,
    className,
    ...props
}) => {
    const isAnimationEndRef = useRef(true)

    return <div className = {`${classes.input} ${className} ${disabled && classes.input_disabled}`}>
          <ErrorDiv 
            error = {isError} 
            isAnimationEndRef = {isAnimationEndRef}
          />
          <input type = "text" {...field} {...props} disabled = {disabled}/>
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
            divRef.current!.classList.add(classes.input__error_active)
        }
    },[error])

    return <div 
    ref = {divRef}
    onAnimationStart={() => {
        isAnimationEndRef.current = false
    }} onAnimationEnd={() => {
        isAnimationEndRef.current = true
        divRef.current!.classList.remove(classes.input__error_active)
    }} className={`${classes.input__error}`}></div>
  
},(prev,next) => {
    if(prev.error !== next.error && next.isAnimationEndRef.current) {
        return false
    }
    return true
})

export default Input