import { AnyAction } from "redux"

const SETAVATAR = "USERINFO/SETAVATAR"
const SETPROFILEINFO = "USERINFO/SETPROFILEINFO"


const intitalState = {
    _id:null as null | string,
    avatar:null as null | string,
    firstName: null as null | string,
    surname: null as null | string,
    birthday: null as null | IBirthday
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
        default:
            return state
    }
}


export const userInfoActions = {
    setAvatarAC: (avatar:string) => ({type:SETAVATAR,payload:{avatar}}), 
    setUserInfoAC: (payload:ISetUserInfo) => ({type:SETPROFILEINFO,payload}), 
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
