import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {CSSTransition} from 'react-transition-group'
import classes from "./Friends.module.scss"
import withCheckAuth from "../HOCs/withCheckAuth"
import SideBar from "../SideBar/SideBar"
import Search from "../svg/Search"
import { useAppSelector } from "@/store/store"
import { UsersApi } from "@/Api/users"
import { useDispatch } from "react-redux"
import { friendsActions, IFriend } from "@/store/FiendsReducer"
import noImage from "@/images/noImage.png"
import { ProfileApi } from "@/Api/profile"


const Friends:React.FC = () => {
    const pageSize = 10

    const [searchParams, setSearchParams] = useSearchParams()

    const dispatch = useDispatch()

    const { userId } = useAppSelector(state => state.login)
    const { other, friends } = useAppSelector(state => state.friends)

    const [isLoading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const [friendsPage, setFriendsPage] = useState(1)
    const [otherUsersPage, setOtherUsersPage] = useState(1)

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    
    async function getUsers(search:string) {
        const response = await UsersApi.getUsers({
            page:otherUsersPage,
            pageSize,
            search
        })

        return response.payload.users
    }
    async function getFriends(search:string) {
        const response = await UsersApi.getFriends({
            userId,
            page:friendsPage,
            pageSize,
            search
        })

        return response.payload.users
    }

    function inputChange(e:SyntheticEvent) {
        const target = e.target as HTMLInputElement
        
        if(timeoutRef.current) 
            clearTimeout(timeoutRef.current)
        if(!target.value) {
            dispatch(friendsActions.setOtherUsersAC({users: []}))
            setInputValue(target.value)
            return
        }
        
        timeoutRef.current = setTimeout(async () => {
            const users = await getUsers(target.value.trim())
            const friends = await getFriends(target.value.trim())
            dispatch(friendsActions.setFriendsAC({users: [...friends]}))
            dispatch(friendsActions.setOtherUsersAC({users: [...users]}))
        },1000) 

        setInputValue(target.value)
    }

    useEffect(() => {
        (async function() {
            const friends = await getFriends("")
            dispatch(friendsActions.setOtherUsersAC({users: []}))
            dispatch(friendsActions.setFriendsAC({users: [...friends]}))
        })()
    },[])
    useEffect(() => {
        (async function() {
            if(!inputValue.length) {
                const friends = await getFriends("")
                dispatch(friendsActions.setFriendsAC({users: [...friends]}))
            }
        })()
    },[inputValue])

    return <div className={classes.friends}>
        <div className={classes.friends__container}>
            <div className={classes.friends__sidebar}>
                <SideBar />
            </div> 
            <div className={classes.friends__body}>
                {
                    !isLoading && <>
                        <div className={`${classes.friends__top} ${classes.friends__block}`}>
                            <div className={`${classes.friends__input} ${classes.input}`}>
                                <Search width={24} height={24} color={"none"}/>
                                <div className={classes.input__wrapped}>
                                    <input value={inputValue} onChange = {inputChange}/>
                                    <span className={`${classes.input__placeholder} ${inputValue && classes.input__placeholder_none}`}>Поиск друзей</span>
                                </div>
                            </div>
                            <div className={classes.friends__friends}>
                                {friends.map((el:IFriend) => {
                                    return <Card key = {el._id} user={el}/>
                                })}
                            </div>
                        </div>
                        {other.length > 0 && 
                            <div className={`${classes.friends__other}  ${classes.friends__block}`}>
                                {other.map((el:IFriend) => {
                                    if(el._id === userId)
                                        return
                                    return <Card key = {el._id} user={el}/>
                                })}
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    </div>
}

interface ICardProps {
    user:IFriend
}

const Card:React.FC<ICardProps> = ({ user }) => {
    const navigate = useNavigate()

    const { isAuth } = useAppSelector(state => state.login)

    const [ isFriend, setIsFriend ] = useState(false)
    const [ avatar, setAvatar ] = useState("")
    const [ dotsHover, setDotsHover ] = useState(false)

    const listBlockRef = useRef<HTMLDivElement>(null)
    const dotsBlockRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)



    function redirect() {
        navigate(`/profile?id=${user._id}`,{
            replace:true
        })
    }

    async function addToFriend() {
        const response = await UsersApi.addToFriend(user._id)
        if(response.message === "success") {
            setIsFriend(response.payload.isFriend)
        }
    }

    async function deleteFriend() {
        const response = await UsersApi.deleteFriend(user._id)
        if(response.message === "success") {
            setIsFriend(response.payload.isFriend)
        }
    }

    async function getAvatar() {
        const avatarUrlResponse = await ProfileApi.getImageUrl({public_id:user.avatar})
        if(avatarUrlResponse.message === "success") { 
            setAvatar(avatarUrlResponse.payload.image_url)
        }
    }

    useEffect(() => {
        (async function() {
            const response = await UsersApi.isFriend(user._id)
            
            if(response.message === "success") {
                setIsFriend(response.payload.isFriend)
            }
            await getAvatar()
        })()
    },[])

    
    return <div className={classes.card}>
        <div className={classes.card__wrapped}>
            <div className={classes.card__left}>
                <div className={classes.card__avatar}>
                    <img src = {avatar || noImage}/>
                </div>
                <div className={classes.card__info}>
                    <div className={classes.card__fullname} onClick = {redirect}>
                        <span>{`${user.firstName} ${user.surname}`}</span>
                    </div>
                </div>
            </div>
            <div className={classes.card__right}>
                {
                    (isAuth && !isFriend) &&
                        <div className={classes.card__add}>
                            <button onClick = {addToFriend}>Добавить в друзья</button>
                        </div>
                }
                {
                    isFriend && 
                    <div className={`${classes.card__menu} ${classes.manu}`}>
                        <div className={classes.menu__wrapped}>
                            <div onMouseEnter={() => {
                                if(timeoutRef.current) {
                                    clearTimeout(timeoutRef.current)
                                }
                                setDotsHover(true)
                            }} 
                            onMouseOut={() => {
                                timeoutRef.current = setTimeout(() => {
                                    setDotsHover(false)
                                },1000)
                            }}
                            ref = {dotsBlockRef} className={classes.menu__dots}>
                                <div></div>
                            </div>
                            <CSSTransition
                                in = {dotsHover}
                                timeout = {300}
                                classNames = {{
                                    enter:classes.animation__enter,
                                    enterActive:classes.animation__enter_active,
                                    exit:classes.animation__exit,
                                    exitActive:classes.animation__exit_active
                                }}
                                nodeRef = {listBlockRef}
                                unmountOnExit
                            >
                                <div onMouseEnter={() => {
                                    if(timeoutRef.current) {
                                        clearTimeout(timeoutRef.current)
                                    }
                                    setDotsHover(true)
                                }} 
                                    onMouseLeave={() => {
                                        timeoutRef.current = setTimeout(() => {
                                            setDotsHover(false)
                                        },1000)
                                    }}
                                    onMouseMove = {() => {
                                        if(timeoutRef.current) {
                                            clearTimeout(timeoutRef.current)
                                        }
                                    }}
                                ref = {listBlockRef} className={`${classes.menu__list} ${classes.friends__block}`}>
                                    <ul>
                                        <li onClick = {deleteFriend}>Удалить из друзей</li>
                                    </ul>
                                </div>
                            </CSSTransition>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
}


export default withCheckAuth(Friends)