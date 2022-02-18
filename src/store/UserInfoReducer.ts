import { AnyAction } from "redux"

const SETAVATAR = "USERINFO/SETAVATAR"
const SETPROFILEINFO = "USERINFO/SETPROFILEINFO"
const SETPOSTS = "USERINFO/SETPOSTS"


const intitalState = {
    _id:null as null | string,
    avatar:null as null | string,
    firstName: null as null | string,
    surname: null as null | string,
    birthday: null as null | IBirthday,
    posts: [] as [] | Posts
}

const UserInfoReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        case SETAVATAR: 
            return {
                ...state,
                avatar:action.payload.avatar
            }
        case SETPROFILEINFO:
            return {
                ...state,
                _id:action.payload._id,
                firstName: action.payload.firstName,
                surname: action.payload.surname,
                birthday: action.payload.birthday,
            }
        case SETPOSTS: 
            return {
                ...state,
                posts:action.payload.posts
            }
        default:
            return state
    }
}


export const userInfoActions = {
    setAvatarAC: (avatar:string) => ({type:SETAVATAR,payload:{avatar}}), 
    setUserInfoAC: (payload:ISetUserInfo) => ({type:SETPROFILEINFO,payload}),
    setPosts: (posts:Posts) => ({type:SETPOSTS,payload:{posts}})
}


export default UserInfoReducer

interface ISetUserInfo {
    _id:string,
    firstName:string,
    surname:string,
    birthday: IBirthday
}

interface IBirthday {
    day:string,
    month:string,
    year:string
}

type Posts = Array<IPost>

export interface IPost {
    _id:string,
    date: string,
    likes:number,
    text:string,
    imagesIds:string,
    author: {
        _id:string,
        avatar:string,
        firstName:string,
        surname:string
    }
}
