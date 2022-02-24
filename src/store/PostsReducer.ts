import { AnyAction } from "redux"

const SETPOSTS = "USERINFO/SETPOSTS"
const SETLIKE = "USERINFO/SETLIKE"


const intitalState = {
    posts: [] as [] | Posts
}

const PostsReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        case SETPOSTS: 
            return {
                ...state,
                posts:action.payload.posts
            }
        case SETLIKE: 
            return {
                ...state,
                posts:state.posts.map(el => {
                    const post = el

                    if(String(post._id) === String(action.payload.postId)){
                        post.isLiked = action.payload.isLiked
                        post.likes = action.payload.likes
                    }


                    return post
                })
            }
        default:
            return state
    }
}


export const postsActions = {
    setPosts: (posts:Posts) => ({type:SETPOSTS,payload:{posts}}),
    setLike: (payload:ISetIsLike) => ({type:SETLIKE,payload})
}


export default PostsReducer

type Posts = Array<IPost>

interface ISetIsLike {
    postId:string,
    isLiked:boolean,
    likes:number
}

export interface IPost {
    _id:string,
    date: string,
    likes:number,
    isLiked:boolean,
    text:string,
    imagesIds:string,
    author: {
        _id:string,
        avatar:string,
        firstName:string,
        surname:string
    }
}
