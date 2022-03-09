import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {CSSTransition} from 'react-transition-group'
import classes from "./Friends.module.scss"
import SideBar from "../SideBar/SideBar"
import Search from "../svg/Search"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { UsersApi } from "@/Api/users"
import { useDispatch } from "react-redux"
import { friendsActions, IFriend } from "@/store/FiendsReducer"
import noImage from "@/images/noImage.png"
import { ProfileApi } from "@/Api/profile"
import { IApiResponse } from "@/Api/interfacesApi"
import { NotificationsApi } from "@/Api/notifications"
import withAuth from "../HOCs/withAuth"


interface IProps {
    isLoadingHOC?:boolean
}

const Friends:React.FC<IProps> = ({ isLoadingHOC }) => {
    const pageSize = 10

    const { userId } = useAppSelector(state => state.login)

    const dispatch = useDispatch()

    const [isLoading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const [friendsPage, setFriendsPage] = useState(1)
    const [totalFriendsPages, setTotalFriendsPages] = useState(1)

    const [otherUsersPage, setOtherUsersPage] = useState(1)
    const [totalOtherUsersPages, setTotalOtherUsersPages] = useState(1)
    
    
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function inputChange(e:SyntheticEvent) {
        const target = e.target as HTMLInputElement
        
        if(timeoutRef.current) 
            clearTimeout(timeoutRef.current)
        
        timeoutRef.current = setTimeout(async () => {
            const friends = await getFriends(target.value.trim(),1)
            if(friends.message === "success")
                dispatch(friendsActions.setFriendsAC({users: [...friends.payload.users]}))
            setFriendsPage(1)
            setOtherUsersPage(1)
            if(!target.value) {
                dispatch(friendsActions.setOtherUsersAC({users: []}))
                return
            }
            const users = await getUsers(target.value.trim(),1)
            if(users.message === "success")
                dispatch(friendsActions.setOtherUsersAC({users: [...users.payload.users]}))
            
        },1000) 

        setInputValue(target.value)
    }
  
    async function getFriends(search:string,page = friendsPage) {
        const response = await UsersApi.getFriends({
            userId,
            page,
            pageSize,
            search
        })
        if(response.message === "success")
            setTotalFriendsPages(response.payload.totalPages)
        return response
    }

    async function getUsers(search:string,page = otherUsersPage) {
        const response = await UsersApi.getUsers({
            page,
            pageSize,
            search
        })
        if(response.message === "success")
            setTotalOtherUsersPages(response.payload.totalPages)
        return response
    }

    return <div className={classes.friends}>
        <div className={classes.friends__container}>
            <div className={classes.friends__sidebar}>
                <SideBar dontClick={isLoadingHOC || isLoading}/>
            </div> 
            <div className={classes.friends__body}>
                {
                    isLoading || isLoadingHOC || 
                    <>
                        <div className={`${classes.friends__top} ${classes.friends__block}`}>
                            <div className={`${classes.friends__input} ${classes.input}`}>
                                <Search width={24} height={24} color={"none"}/>
                                <div className={classes.input__wrapped}>
                                    <input value={inputValue} onChange = {inputChange}/>
                                    <span className={`${classes.input__placeholder} ${inputValue && classes.input__placeholder_none}`}>Поиск друзей</span>
                                </div>
                            </div>
                            <div className={classes.friends__friends}>
                                <FriendsLists setPage={setFriendsPage} totalPages = {totalFriendsPages} getUsers={getFriends} page={friendsPage} inputValue={inputValue}/>
                            </div>
                        </div>
                        
                        <div className={`${classes.friends__other}  ${classes.friends__block}`}>
                            <OtherUsersList getUsers={getUsers} page = {otherUsersPage} setPage = {setOtherUsersPage} totalPages = {totalOtherUsersPages} inputValue={inputValue} />
                        </div>
                        
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

    const [ isLoading, setLoading ] = useState(true)


    const [ isFriend, setIsFriend ] = useState(false)
    const [ isSentInvite, setIsSentInvite ] = useState(false)
    const [ avatar, setAvatar ] = useState("")
    const [ dotsHover, setDotsHover ] = useState(false)

    const isMountedRef = useRef<boolean>(true)
    const listBlockRef = useRef<HTMLDivElement>(null)
    const dotsBlockRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)



    function redirect() {
        navigate(`/profile?id=${user._id}`,{
            replace:true
        })
    }

    async function addToFriend() {
        const response = await NotificationsApi.sendFriendInvite(user._id)
        if(response.message === "success") {
            setIsSentInvite(true)
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
        if(avatarUrlResponse.message === "success" && isMountedRef.current) { 
            setAvatar(avatarUrlResponse.payload.image_url)
        }
    }

    useEffect(() => {
        isMountedRef.current = true;
        (async function() {
            setLoading(true)

            const response = await UsersApi.isFriend(user._id)
            
            if(response.message === "success" && isMountedRef.current) {
                setIsFriend(response.payload.isFriend)
            }
            await getAvatar()
            if(isMountedRef.current)
                setLoading(false)
        })()

        return () => {
            isMountedRef.current = false
        }
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
            {
                !isLoading && 
                <div className={classes.card__right}>
                    {
                        isAuth && !isFriend && !isSentInvite &&
                            <div className={classes.card__add}>
                                <button onClick = {addToFriend}>Добавить в друзья</button>
                            </div>
                    }
                    {
                        isSentInvite && 
                        <div className={classes.card__sent}>
                            Заявка отправлена
                        </div>
                    }
                    {
                        isFriend && 
                        <div className={`${classes.card__menu} ${classes.manu}`}>
                            <div className={classes.menu__wrapped}>
                                <div onMouseEnter={() => {
                                    if(timeoutRef.current) {
                                        clearTimeout(timeoutRef.current)
                                        timeoutRef.current = null
                                    }
                                    setDotsHover(true)
                                }} 
                                onMouseLeave ={(e) => {
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
                                            timeoutRef.current = null
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
                                                timeoutRef.current = null
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
            }
        </div>
    </div>
}

interface IPropsList {
    inputValue:string,
    page:number,
    setPage:(page:number) => void
    getUsers:(search:string,page?:number) => Promise<IApiResponse>,
    totalPages:number
}

const FriendsLists:React.FC<IPropsList> = ({inputValue,page, getUsers, totalPages, setPage}) => {
    const { friends } = useAppSelector(state => state.friends)

    const dispatch = useAppDispatch()

    const [ isLoadingPagination, setLoadingPagination ] = useState(false)
    const isLoadingPaginationRef = useRef<boolean>(isLoadingPagination)

    const observerRef = useRef<HTMLDivElement>(null)
    isLoadingPaginationRef.current = isLoadingPagination

    useEffect(() => {
        const target = observerRef.current
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingPaginationRef.current && totalPages > page) {
                setLoadingPagination(true)
                setPage(page + 1)
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
    },[observerRef.current,friends])

    useEffect(() => {
        (async function() {
            const friendsResponse = await getUsers(inputValue)
            if(friendsResponse.message === "success" && page <= 1) {
                dispatch(friendsActions.setFriendsAC({users: [...friendsResponse.payload.users]}))
            }
            else if(friendsResponse.message === "success" && page > 1){
                dispatch(friendsActions.setFriendsAC({users: [...friends,...friendsResponse.payload.users]}))
            }
            setLoadingPagination(false)
        })()
    },[page])

    return <>  
        {friends.map((el:IFriend) => {
            return <Card key = {el._id} user={el}/>
        })}
        <div ref={observerRef} className={classes.observer}></div>
    </>
}


const OtherUsersList:React.FC<IPropsList> = ({inputValue,getUsers,page,setPage,totalPages}) => {
    const { userId } = useAppSelector(state => state.login)
    const { other } = useAppSelector(state => state.friends)
    
    const dispatch = useAppDispatch()

    const [ isLoadingPagination, setLoadingPagination ] = useState(false)
    const isLoadingPaginationRef = useRef<boolean>(isLoadingPagination)

    const observerRef = useRef<HTMLDivElement>(null)
    isLoadingPaginationRef.current = isLoadingPagination

  
    useEffect(() => {
        const target = observerRef.current
        if(!target)
            return
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingPaginationRef.current && totalPages > page) {
                setLoadingPagination(true)
                setPage(page + 1)
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
    },[observerRef.current,other])

    useEffect(() => {
        (async function() {
            if(inputValue.length < 1) {
                dispatch(friendsActions.setOtherUsersAC({users: []}))
                setPage(1)
                return
            }
            const usersResponse = await getUsers(inputValue)
            if(usersResponse.message === "success" && page <= 1 ) {
                dispatch(friendsActions.setOtherUsersAC({users: [...usersResponse.payload.users]}))
            } else if(usersResponse.message === "success" && page > 1) {
                dispatch(friendsActions.setOtherUsersAC({users: [...other,...usersResponse.payload.users]}))
            }
            setLoadingPagination(false)
        })()
    },[page])

    return <>
        {other.length > 0 && other.map((el:IFriend) => {
            if(el._id === userId)
                return
            return <Card key = {el._id} user={el}/>
        })}
        {
            other.length > 0 && 
                <div ref={observerRef} className={classes.observer}></div>
        }
    </>
} 


export default withAuth(Friends)