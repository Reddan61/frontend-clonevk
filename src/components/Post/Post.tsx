import React, { useEffect, useState } from "react"
import { ProfileApi } from "@/Api/profile"
import { IPost } from "@/store/UserInfoReducer"
import ImagesGrid from "../ImagesGrid/ImagesGrid"
import classes from "./Post.module.scss"
import noImage from "@/images/noImage.png"
import CustomDate from "@/utils/customDate"


interface IProps {
    post:IPost
}

const Post:React.FC<IProps> = ({post}) => {
    const { date, likes, text, author, imagesIds } = post

    const dateInstance = new Date(date)

    const [isLoading, setLoading] = useState(true)
    const [images,setImages] = useState<Array<string>>([])
    const [avatar,setAvatar] = useState<string>("")
    
    useEffect(() => {
        (async function() {
            const imagesResponse:Array<string> = []
            if(imagesIds && imagesIds.length > 0) {
                for(let i = 0; i < imagesIds.length; i++) {
                    const response = await ProfileApi.getImageUrl({public_id:imagesIds[i]})
                    if(response.message === "success") {
                        imagesResponse.push(response.payload.image_url)
                    }
                }
            }
            const response = await ProfileApi.getImageUrl({public_id:post.author.avatar})
            if(response.message === "success")
                setAvatar(response.payload.image_url)
            setImages(imagesResponse)
            setLoading(false)
        })()
    },[])

    if(isLoading) {
        return <Skeleton />
    }
    return <div className={classes.post}>
        <div className={classes.post__wrapped}>
            <div className={classes.post__header}>
                <div className={classes.card}>
                    <div className={classes.card__image}>
                        <img src = {avatar || noImage}/>
                    </div>
                    <div className={classes.card__info}>
                        <div className={classes.card__name}>
                            <span>{author.firstName}</span>
                            <span>{author.surname}</span>
                        </div>
                        <div className={classes.card__date}>
                            {`${dateInstance.getDay()} ${CustomDate.getMonth(dateInstance.getMonth())} ${dateInstance.getFullYear()}`}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.post__body}>
                {
                    text && 
                    <div className={classes.post__text}>
                        {
                            text
                        }
                    </div>
                }
                {
                    images.length > 0 && 
                    <ImagesGrid images={images} canBeDelete = {false}/>
                }
            </div>
        </div>
    </div>
}


const Skeleton:React.FC = () => {
    return <div className={classes.skeleton}>
        <div className={classes.skeleton__wrapped}>
        <div className={classes.skeleton__header}>
                <div className={classes.skeleton__card}>
                    <div className={classes.skeleton__image}>
                    </div>
                    <div className={classes.skeleton__info}>
                        <div className={classes.skeleton__name}>
                        </div>
                        <div className={classes.skeleton__date}>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.skeleton__body}>
                
            </div>
        </div>
    </div>
}

export default Post