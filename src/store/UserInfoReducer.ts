import { AnyAction } from "redux"

const SETAVATAR = "USERINFO/SETAVATAR"


const intitalState = {
    avatar:null as null | string
}

const UserInfoReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        case SETAVATAR: 
            return {
                ...state,
                avatar:action.payload.avatar
            }
        default:
            return state
    }
}


export const userInfoActions = {
    setAvatarAC: (avatar:string) => ({type:SETAVATAR,payload:{avatar}}) 
}


export default UserInfoReducer