import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import SideBar from "@/components/SideBar/SideBar"
import classes from "./Profile.module.scss"
import { ProfileApi } from "@/Api/profile";
import { useAppDispatch, useAppSelector } from "@/store/store";
import withCheckAuth from "../HOCs/withCheckAuth";
import { userInfoActions } from "@/store/ProfileReducer";
import noImage from "@/images/noImage.png"
import ArrowUp from "../svg/ArrowUp";
import { CSSTransition } from "react-transition-group";
import CustomDate from "@/utils/customDate";
import Camera from "../svg/Camera";
import { ICreatePostPayload, PostsApi } from "@/Api/posts";
import ImagesGrid from "../ImagesGrid/ImagesGrid";
import { isMongoDBId } from "@/utils/isMongoDBId";
import { useDispatch } from "react-redux";
import ProfilePosts from "./ProfilePosts";
import { postsActions } from "@/store/PostsReducer";

interface IProfileProps {
    isLoadingHOC?:boolean
}

const Profile:React.FC<IProfileProps> = ({ isLoadingHOC }) => {
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)

    const [ isUpdatingAvatar, setUpdatingAvatar] = useState(false)
    const [ showMenu, setShowMenu] = useState(false)

    const dispatch = useAppDispatch()

    const { userId } = useAppSelector(state => state.login)
    const { avatar, firstName, birthday, surname, _id } = useAppSelector(state => state.userinfo)

    const isitMe = userId === _id

    const fileInputRef = useRef<HTMLInputElement>(null)
    const nodeRef = useRef(null)

    async function getAvatar(id:string) {
        const avatarIdResponse = await ProfileApi.getAvatar({_id:id})
            
        if(avatarIdResponse.message === "success") {
            const avatarUrlResponse = await ProfileApi.getImageUrl({public_id:avatarIdResponse.payload.public_id})
            if(avatarUrlResponse.message === "success") { 
                dispatch(userInfoActions.setAvatarAC(avatarUrlResponse.payload.image_url))
            }
        }
    }

    async function getProfileInfo(id:string) {
        const profileInfoResponse = await ProfileApi.getProfileInfo({userId:id})
        if(profileInfoResponse.message === "success") {
            dispatch(userInfoActions.setUserInfoAC(profileInfoResponse.payload.user))
        }
    }


    useEffect(() => {
        (async function() {
            if(isLoadingHOC)
                return
            setIsLoading(true)
            const _id =  searchParams.get("id") ? searchParams.get("id") : userId
            if(!isMongoDBId(_id)) {
                navigate("/auth/login",{
                    replace:true
                })
                return 
            }
            await getAvatar(_id)
            await getProfileInfo(_id)
            setIsLoading(false)
        })()
    },[searchParams.get("id"),isLoadingHOC])

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
            alert("???????????????????????? ????????????!")
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            const avatarIdResponse = await ProfileApi.setAvatar({base64Image : reader.result as string})
            if(avatarIdResponse.message === "success") {
                const avatarUrlResponse = await ProfileApi.getImageUrl({public_id:avatarIdResponse.payload.public_id})
                if(avatarUrlResponse.message === "success") { 
                    dispatch(userInfoActions.setAvatarAC(avatarUrlResponse.payload.image_url))
                }
            }
            setUpdatingAvatar(false)
        }

    }

    if(isLoading) {
        return <SkeletonProfile />
    }

    return <div className={classes.profile}>
        <div className={classes.profile__container}>
            <div className={classes.profile__sidebar}>
                <SideBar />
            </div>
            <div className={classes.profile__line}>
                <div className={classes.avatar}>
                    <div className={`${classes.avatar__wrapped} ${classes.profile__block}`}>
                        <div className={classes.avatar__photo} 
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <img src = {avatar?.length ? avatar : noImage}/>
                            <CSSTransition
                                in={showMenu && isitMe}
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
                                        <span>???????????????? ????????????????????</span>
                                    </li>
                                </ul>
                            </CSSTransition>
                        </div>
                    </div>
                    <input ref = {fileInputRef} type = "file" onChange={updateAvatar} className={classes.avatar__input}/>
                </div>
            </div>
            <div className={classes.profile__line}>
                <div className={`${classes.info} ${classes.profile__block}`}>
                    <div className={classes.info__wrapped}>
                        <div className={classes.info__top}>
                            <div className={classes.info__title}>
                                <span>{firstName + " " + surname}</span>
                            </div>
                        </div>
                        <div className={classes.info__center}>
                            <ul className={classes.info__list}>
                                <li>
                                    <span>
                                        ???????? ????????????????:
                                    </span>
                                    <span>
                                       {`${birthday?.day} ${CustomDate.getMonth(+birthday?.month)} ${birthday?.year} ??.`}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    isitMe &&
                    <TextAreaNewPost />
                }
                <div className={`${classes.profile__posts}`}>
                    <ProfilePosts />
                </div>
            </div>
        </div>
    </div>
}

const SkeletonProfile:React.FC = () => {
    return <div className={classes.profile}>
        <div className={classes.profile__container}>
            <div className={classes.profile__sidebar}>
                <SideBar dontClick = {true}/>
            </div>
            <div className={classes.profile__line}>
                <div className={classes.avatar}>
                    <div className={`${classes.avatar__wrapped} ${classes.profile__block}`}>
                        <div className={`${classes.avatar__photo} ${classes.skeleton__photo}`}>
            
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.profile__line}>
                <div className={`${classes.info} ${classes.profile__block}`}>
                    <div className={classes.info__wrapped}>
                        <div className={classes.info__top}>
                            <div className={`${classes.info__title} ${classes.skeleton__title}`}>
                            </div>
                        </div>
                        <div className={classes.info__center}>
                            <ul className={classes.info__list}>
                                <li>
                                    <span className={classes.skeleton__span}>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


const TextAreaNewPost:React.FC = () => {
    const [isClicked,setClicked] = useState(false)
    const [textAreaText, setTextArea] = useState("")
    const [base64Images, setBase64Images] = useState<string[]>([])

    const { userId } = useAppSelector(state => state.login)
    const { avatar } = useAppSelector(state => state.userinfo)
    const { posts } = useAppSelector(state => state.posts)

    const dispatch = useDispatch()

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const refImages = useRef<string[]>(base64Images)
    const refText = useRef<string>(textAreaText)

    refImages.current = base64Images
    refText.current = textAreaText

    function changeCreateTextArea(e:SyntheticEvent<HTMLTextAreaElement>) {
        const target = e.target as HTMLTextAreaElement
        const ref = textareaRef.current
       
        ref!.style.height = "auto"
        ref!.style.height = ref!.scrollHeight + "px"

        setTextArea(target.value)
    }

    async function uploadImage(e:any) {
        const extensions = ["image/png","image/jpeg","image/jpg"]
        const files = e.target.files

        const succesfullFiles = []

        for(let i =0; i<files.length; i++) {
            if(extensions.includes(files[i].type)) {
                succesfullFiles.push(files[i])
            }
        }

        for(let i =0; i<succesfullFiles.length; i++) {
            const reader = new FileReader()

            reader.onloadend = async (e) => {
                const base64Image = e.target!.result as string
                if(base64Images.includes(base64Image)) return
                setBase64Images(state => [...state,base64Image])
                setClicked(true)
            }

            reader.readAsDataURL(succesfullFiles[i])
        }
        
        e.target.value = null
    }
    
    function cameraClick(e:SyntheticEvent<HTMLDivElement>) {
        e.stopPropagation()
        fileInputRef.current!.click()
    }

    function deleteImage(index:number) {
        const arr = [...base64Images]
        arr.splice(index,1)
        setBase64Images(arr)
        if(!arr.length && !textAreaText) {
            setClicked(false)
        }
    }

    useEffect(() => {
        function closeTextArea(e:any) {
            const target = e.target as Element
           
            if(!target.closest(`.${classes.create}`)) {
                if(!refText.current && !refImages.current!.length) {
                    setClicked(false)
                }
            }
        }

        document.addEventListener("click",closeTextArea)
        return () => {
            document.removeEventListener("click",closeTextArea)
        }
    },[])

    async function submit() {
        const payload:ICreatePostPayload = {
            userId,
            images:base64Images,
            text: textAreaText
        }

        setBase64Images([])
        setTextArea("")
        setClicked(false)
        
        if(!payload.images && !payload.text) {
            return
        }
        const response = await PostsApi.create(payload)
        if(response.message === "success")
            dispatch(postsActions.setPosts([response.payload.post,...posts]))
    }

    return <div className={`${classes.create} ${classes.profile__block}`}>
        <input onClick = {(e) => e.stopPropagation()} multiple  ref = {fileInputRef} type = "file" onChange={uploadImage} className={classes.avatar__input}/>
        <div className={`${classes.create__wrapped} ${isClicked && classes.create__wrapped_clicked}`}>
            <div className={`${classes.create__top} ${isClicked && classes.create__top_clicked}`}>
                <div className={classes.create__avatar}>
                    <img src={avatar?.length ? avatar : noImage} />
                </div>
                <div className={`${classes.create__textarea} ${isClicked && classes.create__textarea_clicked}`}>
                    <textarea ref={textareaRef} onChange = {changeCreateTextArea} onFocus={() => {
                            setClicked(true)
                        }} 
                    value={textAreaText}></textarea>
                    <span className={`${classes.create__placeholder} ${(isClicked && textAreaText) && classes.create__placeholder_disable}`}>?????? ?? ?????? ?????????????</span>
                </div>
                {
                    !isClicked && 
                    <div className={classes.create__icons}>
                        <div className={classes.create__camera} onClick = {cameraClick}>
                            <Camera 
                                width={20}
                                height={20}
                                color={"#a4acb5"}
                            />
                        </div>
                    </div>
                }
            </div>   

            {isClicked && <ImagesGrid images={base64Images} deleteImage = {deleteImage} canBeDelete={true}/>}                       
            {
                isClicked && <div className={classes.create__bottom}>
                    <div className={classes.create__icons}>
                        <div className={classes.create__camera} onClick = {cameraClick}>
                            <Camera 
                                width={20}
                                height={20}
                                color={"#a4acb5"}
                            />
                        </div>
                    </div>
                    <div className={classes.create__button}>
                        <button onClick = {submit}>????????????????????????</button>
                    </div>
                </div>
            }
        </div>
    </div>
}


export default withCheckAuth(Profile)