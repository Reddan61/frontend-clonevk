import React, { useEffect, useState } from "react"
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
import { ProfileApi } from "@/Api/profile"


const Header:React.FC = () => {
    const { isAuth, userId } = useAppSelector(state => state.login)
    
    const navigate = useNavigate()

    const [isClickedOnCard, changeClickedOnCard] = useState(false)
    const [avatar,setAvatar] = useState(null)

    const nodeRef = React.useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        (async function() {
            const responsePublicUrl = await ProfileApi.getAvatar({_id:userId})
            if(responsePublicUrl.message === "success") {
                const responseUrl = await ProfileApi.getImageUrl({public_id:responsePublicUrl.payload.public_id})
                if(responseUrl.message === "success")
                    setAvatar(responseUrl.payload.image_url)
            }
        })()
    },[userId])

    return <div className = {classes.header}>
        <div className = {classes.header__container}>
            <div className = {classes.header__logo}>
                <Logo />
            </div>
            {
                isAuth && <div className={classes.header__info}>
                    <div className={`${classes.header__card} ${classes.card}`} onClick={() => changeClickedOnCard(!isClickedOnCard)}>
                        <img src = {avatar ? avatar : noImage} className={classes.card__image}/>
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
