import React, { useState } from "react"
import {CSSTransition} from 'react-transition-group'
import Logo from "@/components/svg/Logo"
import classes from "./Header.module.scss"
import withCheckAuth from "../HOCs/withCheckAuth"
import { useAppSelector } from "@/store/store"
import { loginActions } from "@/store/LoginReducer"
import { useDispatch } from "react-redux"
import noImage from "@/images/noImage.png"
import Exit from "../svg/Exit"
import { useNavigate } from "react-router"


const Header:React.FC = () => {
    const { isAuth } = useAppSelector(state => state.login)
    const { avatar } = useAppSelector(state => state.userinfo)

    const [isClickedOnCard, changeClickedOnCard] = useState(false)
    const navigate = useNavigate()

    const nodeRef = React.useRef(null)

    const dispatch = useDispatch()

    return <div className = {classes.header}>
        <div className = {classes.header__container}>
            <div className = {classes.header__logo}>
                <Logo />
            </div>
            {
                isAuth && <div className={classes.header__info}>
                    <div className={`${classes.header__card} ${classes.card}`} onClick={() => changeClickedOnCard(!isClickedOnCard)}>
                        <img src = {avatar?.length ? avatar : noImage} className={classes.card__image}/>
                        <div className={classes.card__arrow}>
                        </div>
                    </div>
                    <CSSTransition 
                        in = {isClickedOnCard}
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
                        <div className={classes.menu} ref = {nodeRef}>
                            <ul>
                                <li onClick={() =>  {
                                    dispatch(loginActions.logoutAC())
                                    changeClickedOnCard(false)
                                    navigate("/auth/login",{replace:true})
                                }}>
                                    <Exit width={20} height={20} color = "#5181b8"/> <span>Выйти</span>
                                </li>
                            </ul>
                        </div>
                    </CSSTransition>
                </div>
            }
        </div>
    </div>
}

export default withCheckAuth(Header)
