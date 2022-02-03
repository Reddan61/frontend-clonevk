import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom";
import SideBar from "@/components/SideBar/SideBar"
import classes from "./Profile.module.scss"
import { ProfileApi } from "@/Api/profile";
import { useAppDispatch, useAppSelector } from "@/store/store";
import withCheckAuth from "../HOCs/withCheckAuth";
import { userInfoActions } from "@/store/UserInfoReducer";
import noImage from "@/images/noImage.png"
import ArrowUp from "../svg/ArrowUp";
import { CSSTransition } from "react-transition-group";

const Profile:React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [ isUpdatingAvatar, setUpdatingAvatar] = useState(false)
    const [ showMenu, setShowMenu] = useState(false)

    const dispatch = useAppDispatch()

    const { userId } = useAppSelector(state => state.login)
    const { avatar } = useAppSelector(state => state.userinfo)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const nodeRef = useRef(null)

    useEffect(() => {
        (async function() {
            const _id =  searchParams.get("id") ? searchParams.get("id") : userId
            const avatarIdResponse = await ProfileApi.getAvatar({_id})
            
            if(avatarIdResponse.message === "success") {
                const avatarUrlResponse = await ProfileApi.getAvatarUrl({public_id:avatarIdResponse.payload.public_id})
                if(avatarUrlResponse.message === "success") { 
                    dispatch(userInfoActions.setAvatarAC(avatarUrlResponse.payload.image_url))
                }
            }
        })()
    },[])

    function updateAvatar(e:any) {
        e.preventDefault()

        if(isUpdatingAvatar) {
            return
        }

        setUpdatingAvatar(true)

        const extensions = ["image/png","image/jpeg","image/jpg"]
        const file = e.target.files[0]

        if(!file) {
            return
        }

        e.target.value = null
        
        if(!extensions.includes(file.type)) {
            alert("Неправильный формат!")
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            const avatarIdResponse = await ProfileApi.setAvatar({base64Image : reader.result as string})
            if(avatarIdResponse.message === "success") {
                const avatarUrlResponse = await ProfileApi.getAvatarUrl({public_id:avatarIdResponse.payload.public_id})
                if(avatarUrlResponse.message === "success") { 
                    dispatch(userInfoActions.setAvatarAC(avatarUrlResponse.payload.image_url))
                }
            }
            setUpdatingAvatar(false)
        }

    }

    return <div className={classes.profile}>
        <div className={classes.profile__container}>
            <div className={classes.profile__sidebar}>
                <SideBar />
            </div>
            <div className={classes.profile__line}>
                <div className={classes.avatar}>
                    <div className={classes.avatar__wrapped}>
                        <div className={classes.avatar__photo} 
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <img src = {avatar?.length ? avatar : noImage}/>
                            <CSSTransition
                                in={showMenu}
                                timeout={300}
                                classNames = {{
                                    enter:classes.animation__enter,
                                    enterActive:classes.animation__enter_active,
                                    exit:classes.animation__exit,
                                    exitActive:classes.animation__exit_active
                                }}
                                nodeRef={nodeRef}
                                unmountOnExit
                            >
                                <ul ref={nodeRef} className={classes.avatar__menu}>
                                    <li onClick={() => {
                                        fileInputRef.current?.click()
                                    }}>
                                        <ArrowUp width={12} height={12} color="white"/>
                                        <span>Обновить фотографию</span>
                                    </li>
                                </ul>
                            </CSSTransition>
                        </div>
                    </div>
                    <input ref = {fileInputRef} type = "file" onChange={updateAvatar} className={classes.avatar__input}/>
                </div>
            </div>
        </div>
    </div>
}


export default withCheckAuth(Profile)