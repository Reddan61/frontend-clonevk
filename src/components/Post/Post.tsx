import React, { useEffect, useState } from "react"
import { ProfileApi } from "@/Api/profile"
import ImagesGrid from "../ImagesGrid/ImagesGrid"
import classes from "./Post.module.scss"
import noImage from "@/images/noImage.png"
import CustomDate from "@/utils/customDate"
import Heart from "../svg/Heart"
import { PostsApi } from "@/Api/posts"
import redHeart from "@/images/redHeart.png"
import { IPost, postsActions } from "@/store/PostsReducer"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"


interface IProps {
    post:IPost
}

const Post:React.FC<IProps> = ({post}) => {
    const { date, likes, text, author, imagesIds, _id, isLiked } = post
    const dispatch = useDispatch()

    const dateInstance = new Date(date)
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(true)
    const [likeLoading, setLikeLoading] = useState(false)

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
            const responseImage = await ProfileApi.getImageUrl({public_id:author.avatar})
            if(responseImage.message === "success")
                setAvatar(responseImage.payload.image_url)

            const responseLike = await PostsApi.isLiked(_id)

            if(responseLike.message === "success") {
                const payload = {
                    postId:_id,
                    isLiked: responseLike.payload.isLiked,
                    likes
                }
                dispatch(postsActions.setLike(payload))
            }
            setImages(imagesResponse)
            setLoading(false)
        })()
    },[])
    function redirect() {
        navigate(`/profile?id=${author._id}`,{
            replace:true
        })
    }

    async function setLiked() {
        if(likeLoading)
            return
        setLikeLoading(true)
        const response = await PostsApi.setLike(_id)
        if(response.message === "success") {
            const payload = {
                postId: _id,
                isLiked: response.payload.isLiked,
                likes: response.payload.likes
            }
            dispatch(postsActions.setLike(payload))
        }
        setLikeLoading(false)
    }

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
                        <div onClick = {redirect} className={classes.card__name}>
                            <span>{author.firstName}</span>
                            <span>{author.surname}</span>
                        </div>
                        <div className={classes.card__date}>
                            {`${dateInstance.getDate()} ${CustomDate.getMonth(dateInstance.getMonth())} ${dateInstance.getFullYear()}`}
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
            <div className={classes.post__bottom}>
                <div className={`${classes.post__like} ${isLiked && classes.post__like_active}`} onClick = {setLiked}>
                    { isLiked ? 
                        <img src = {redHeart}/>
                    : <Heart 
                        width={24} height={24} color = {"#99a2ad"}
                    />}
                    <span>{likes}</span>
                </div>
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