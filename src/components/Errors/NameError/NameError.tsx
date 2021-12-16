import React from "react"
import {CSSTransition} from 'react-transition-group'
import classes from "./NameError.module.scss"

interface IProps {
    isShow:boolean
}

const NameErrorMessage:React.FC<IProps> = ({isShow}) => {
    const nodeRef = React.useRef(null)

    return <CSSTransition
        in = {isShow}
        timeout = {300}
        classNames = {{
            enter:classes.animation__enter,
            enterActive:classes.animation__enter_active,
            exit:classes.animation__exit,
            exitActive:classes.animation__exit_active
        }}
        nodeRef = {nodeRef}
        unmountOnExit
    >
        <div className={classes.error} ref = {nodeRef}>
            <div className={classes.error__wrapped}>
                <div className={classes.error__title}>
                    <b>Пожалуйста, укажите ваше имя и&nbsp;фамилию.</b>
                </div>
                <div className={classes.error__text}>
                    Чтобы облегчить общение и поиск друзей, у&nbsp;нас приняты настоящие имена и фамилии.
                </div>
            </div>
            <div className={classes.error__arrow}></div>
        </div>
    </CSSTransition> 
}

export default React.memo(NameErrorMessage)