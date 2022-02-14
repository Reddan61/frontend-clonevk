import React, { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from "react"
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
import CustomDate from "@/utils/customDate";
import Camera from "../svg/Camera";

const Profile:React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [ isUpdatingAvatar, setUpdatingAvatar] = useState(false)
    const [ showMenu, setShowMenu] = useState(false)


    const dispatch = useAppDispatch()

    const { userId } = useAppSelector(state => state.login)
    const { avatar, firstName, birthday, surname, _id } = useAppSelector(state => state.userinfo)

    const isitMe = userId === _id

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
    },[searchParams.get("id")])

    useEffect(() => {
        (async function() {
            const _id =  searchParams.get("id") ? searchParams.get("id") : userId
            const profileInfoResponse = await ProfileApi.getProfileInfo({userId:_id})
            if(profileInfoResponse.message === "success") {
                dispatch(userInfoActions.setUserInfoAC(profileInfoResponse.payload.user))
            }
        })()
    },[searchParams.get("id")])

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
                                        <span>Обновить фотографию</span>
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
                                        День рождения:
                                    </span>
                                    <span>
                                       {`${birthday?.day} ${CustomDate.getMonth(+birthday?.month)} ${birthday?.year} г.`}
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
            </div>
        </div>
    </div>
}


const TextAreaNewPost:React.FC = () => {
    const [isClicked,setClicked] = useState(false)
    const [textAreaText, setTextArea] = useState("")
    const [base64Images, setBase64Images] = useState<ArrayBuffer[]>([])

    const { avatar } = useAppSelector(state => state.userinfo)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const imagesBlockRef = useRef<HTMLDivElement>(null)
    const imagesSideBlockRef = useRef<HTMLDivElement>(null)

    const refImages = useRef<ArrayBuffer[]>(base64Images)
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
                const base64Image = e.target!.result as ArrayBuffer
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

    function deleteImageEvent(e:SyntheticEvent<HTMLDivElement>,position:number) {
        const target = e.target as HTMLTextAreaElement
        const parentDiv:HTMLDivElement | null = target.closest(`.${classes.create__image}`)
        if(!parentDiv) return
        parentDiv.style.transition = "all .3s linear 0s"
        parentDiv.style.width = "0"
        parentDiv.style.height = "0"
        setTimeout(() => {
            deleteImage(position)
        },300)
    }

    //calculate sidebar of images
    useEffect(() => {
        if(!imagesBlockRef || !imagesBlockRef.current) {
            return
        }
        const sideImages:NodeListOf<HTMLDivElement> = imagesBlockRef.current.querySelectorAll(".create__image_js")
        const imageHeight = 340 / sideImages.length

        sideImages.forEach((el) => {
            if(base64Images.length > 1 && imagesSideBlockRef.current) {
                imagesSideBlockRef.current.style.maxWidth = `35%`
            }
            el.style.maxHeight = imageHeight + "px"
        })
    },[base64Images,isClicked])

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
                    <span className={`${classes.create__placeholder} ${(isClicked && textAreaText) && classes.create__placeholder_disable}`}>Что у вас нового?</span>
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

            {isClicked && <div ref= {imagesBlockRef} className={classes.create__images}>
                <div className={classes.create__images_top}>
                    <div className={classes.create__images_one}>
                        {
                            base64Images.slice(0,1).map((el,index) => {
                                return <div  key = {`${el} ${index}`} className={`${classes.create__image}`}>
                                    <img 
                                        src = {`${el}`}
                                    />
                                    <div onClick={(e) => {
                                       deleteImageEvent(e,0)
                                    }}>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div ref = {imagesSideBlockRef} className={classes.create__images_side}>
                        {
                            base64Images.slice(1,4).map((el,index) => {
                                return <div  key = {`${el} ${index + 1}`} className={`${classes.create__image} create__image_js`}>
                                    <img 
                                        src = {`${el}`}
                                    />
                                    <div onClick={(e) => {
                                       deleteImageEvent(e,index+1)
                                    }}>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className={classes.create__images_bottom}>
                    {
                            base64Images.slice(4,base64Images.length).map((el,index) => {
                                return <div  key = {`${el} ${index + 4}`} className={`${classes.create__image} ${classes.create__image_bottom}`}>
                                    <img 
                                        src = {`${el}`}
                                    />
                                    <div onClick={(e) => {
                                        deleteImageEvent(e,index+4)
                                    }}>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                </div>
            </div>}                       
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
                        <button>Опубликовать</button>
                    </div>
                </div>
            }
        </div>
    </div>
}


export default withCheckAuth(Profile)