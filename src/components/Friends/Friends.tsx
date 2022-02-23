import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import classes from "./Friends.module.scss"
import withCheckAuth from "../HOCs/withCheckAuth"
import SideBar from "../SideBar/SideBar"
import Search from "../svg/Search"
import { useAppSelector } from "@/store/store"
import { UsersApi } from "@/Api/users"
import { useDispatch } from "react-redux"
import { friendsActions, IFriend } from "@/store/FiendsReducer"
import noImage from "@/images/noImage.png"


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

    function redirect() {
        navigate(`/profile?id=${user._id}`,{
            replace:true
        })
    }

    async function addToFriend() {
        const response = await UsersApi.addToFriend(user._id)
        console.log(response)
    }
    
    return <div className={classes.card}>
        <div className={classes.card__wrapped}>
            <div className={classes.card__left}>
                <div className={classes.card__avatar}>
                    <img src = {noImage}/>
                </div>
                <div className={classes.card__info}>
                    <div className={classes.card__fullname} onClick = {redirect}>
                        <span>{`${user.firstName} ${user.surname}`}</span>
                    </div>
                </div>
            </div>
            <div className={classes.card__right}>
                <div className={classes.card__add}>
                    <button onClick = {addToFriend}>Добавить в друзья</button>
                </div>
            </div>
        </div>
    </div>
}


export default withCheckAuth(Friends)