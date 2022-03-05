import React, { useEffect, useRef, useState } from "react"
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
import { UsersApi } from "@/Api/users"
import Bell from "../svg/Bell"
import { NotificationsApi } from "@/Api/notifications"


const Header:React.FC = () => {
    const { isAuth, userId } = useAppSelector(state => state.login)
    
    const navigate = useNavigate()

    const [isClickedOnCard, changeClickedOnCard] = useState(false)
    const [isClickedOnBell, changeClickedOnBell] = useState(false)
    const [avatar,setAvatar] = useState(null)
    const [notifications,setNotifications] = useState<Array<INotification>>([])

    const [notificationsPage, setNotificationsPage] = useState(1)
    const [totalNotificationsPages, setTotalNotificationsPages] = useState(1)
    
    const [totalNotReadNotifications, setTotalNotReadNotifications] = useState(0)

    const [ isLoadingPagination, setLoadingPagination ] = useState(false)
    const isLoadingPaginationRef = useRef<boolean>(isLoadingPagination)

    const observerRef = useRef<HTMLDivElement>(null)
    isLoadingPaginationRef.current = isLoadingPagination

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
            setNotificationsPage(1)
            setTotalNotificationsPages(1)
        })()
    },[userId])

    useEffect(() => {
        getTotalNotRead()
    },[isAuth])

    useEffect(() => {
        (async function() {
            if(!isClickedOnBell) 
                return
            const responseGetNotifications = await NotificationsApi.getNotifications({
                page:notificationsPage,
                pageSize:10
            })

            if(responseGetNotifications.message === "success") {
                setNotifications(responseGetNotifications.payload.notifications)
                setTotalNotificationsPages(responseGetNotifications.payload.totalPages)
            }
        })()
    },[isClickedOnBell])

    useEffect(() => {
        const target = observerRef.current
        if(!target)
            return
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingPaginationRef.current && totalNotificationsPages > notificationsPage) {
                setLoadingPagination(true)
                setNotificationsPage(notificationsPage + 1)
            }
        },{
            root:null,
            rootMargin:'0px',
            threshold:0.1
        })
        if(target) {
            observer.observe(target)
        }
        return () => {
            if(target)
                observer.unobserve(target)
        }
    },[observerRef.current,notifications])

    async function getTotalNotRead() {
        if(!isAuth) {
            return
        }
        const response = await NotificationsApi.getTotalNotReadNotifications()
        if(response.message === "success")
            setTotalNotReadNotifications(response.payload.totalNotifications)
    }

    return <div className = {classes.header}>
        <div className = {classes.header__container}>
            <div className = {classes.header__left}>
                <div className = {classes.header__logo}>
                    <Logo />
                </div>
                {
                    isAuth && 
                    <div className = {classes.header__notifications}>
                        <div onClick = {() => changeClickedOnBell(!isClickedOnBell)} className = {classes.header__bell}>
                            <Bell width={24} height={24} color="#8b939d"/>
                        </div>
                        {
                            totalNotReadNotifications > 0 && 
                            <div className={classes.notifications__total}>
                                <span>
                                    {`${totalNotReadNotifications > 99 ? 99 : totalNotReadNotifications}`}
                                </span>
                            </div>
                        }
                        {
                            isClickedOnBell && <div className={classes.notifications}>
                                <div className={classes.notifications__title}>Ваша страница</div>
                                <div className={classes.notifications__body}>
                                    {
                                        notifications.map(el => {
                                            return <Notification key = {el._id} setNotifications = {setNotifications} notification={el} getTotalNotRead = {getTotalNotRead} />
                                        })
                                    }
                                    <div ref = {observerRef} className = {classes.observer}></div>
                                </div>  
                            </div>
                        }
                    </div>
                }
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

interface INotification {
    _id:string,
    isRead:boolean,
    author: {
        _id:string,
        firstName:string,
        surname:string,
        avatar:string
    },
    type:string
}

interface INotificationProp {
    notification: INotification,
    getTotalNotRead: () => Promise<void>,
    setNotifications: (payload:any) => void
}

const Notification:React.FC<INotificationProp> = ({notification,getTotalNotRead,setNotifications}) => {
    const [avatar,setAvatar] = useState(null)
    const [isAddedFriend,setIsAddedFriend] = useState(false)
    const [isLoadingSetIsRead,setLoadingIsRead] = useState(false)

    const rootDivRef = useRef<HTMLDivElement>(null)
    const isLoadingSetIsReadRef = useRef(false)
    isLoadingSetIsReadRef.current = isLoadingSetIsRead

    const navigate = useNavigate()

    useEffect(() => {
        (async function() {
            const responseUrl = await ProfileApi.getImageUrl({public_id:notification.author.avatar})
            if(responseUrl.message === "success")
                setAvatar(responseUrl.payload.image_url)
        })()
    },[])

    useEffect(() => {
        const target = rootDivRef.current
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingSetIsReadRef.current && !notification.isRead) {
                setLoadingIsRead(true)
                setIsRead()
            }
        },{
            root:null,
            rootMargin:'0px',
            threshold:0.1
        })
        if(target) {
            observer.observe(target)
        }
        return () => {
            if(target)
                observer.unobserve(target)
        }
    },[rootDivRef.current])

    async function acceptFriendInvite() {
        const response = await NotificationsApi.acceptInviteFriend(notification._id)
        if(response.message === "success") {
            setIsAddedFriend(true)
        }
    }

    function redirect() {
        navigate(`/profile?id=${notification.author._id}`,{
            replace:true
        })
    }

    async function setIsRead() {
        const response = await NotificationsApi.setIsReadNotification(notification._id)
        if(response.message === "success") {
            getTotalNotRead()
            setNotifications((state:Array<INotification>) => {
                return state.map((el:INotification) => {
                    const notificationElement = el
                    if(el._id === notification._id)
                        notificationElement.isRead = response.payload.isRead
                    return notificationElement
                })
            })
        }
        setLoadingIsRead(false)
    }

    return <div ref = {rootDivRef} className={classes.notification}>
        <div className={classes.notification__wrapped}>
            <div className={classes.notification__left}>
                <img src={avatar || noImage} />
            </div>
            <div className={classes.notification__right}>
                <div className={classes.notification__info}>
                    <span className={classes.notification__fullname} onClick = {redirect}>
                        { `${notification.author.firstName} ${notification.author.surname} `}
                    </span>
                    <span className={classes.notification__text}>хочет добавить вас в друзья</span>
                </div>
                <div className={classes.notification__button}>
                    {
                        isAddedFriend ?
                            "Добавлен"
                        :
                        <button onClick = {acceptFriendInvite}>Добавить в друзья</button>
                    }
                </div>
            </div>
        </div>
</div>
}

export default withCheckAuth(Header)
