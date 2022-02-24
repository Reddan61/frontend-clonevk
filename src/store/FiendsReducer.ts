import { AnyAction } from "redux"

const GETOTHERUSERS = "FRIENDS/GETOTHERUSERS"
const SETFRIENDS = "FRIENDS/SETFRIENDS"
const SETNEWFRIEND = "FRIENDS/SETNEWFRIEND"


const intitalState = {
    friends: [] as IFriend[],
    other: [] as IFriend[]
}

const FriendsReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        case GETOTHERUSERS: 
            return {
                ...state,
                other: action.payload.users
            }
        case SETFRIENDS: 
            return {
                ...state,
                friends: action.payload.users
            }
        default:
            return state
    }
}


export const friendsActions = {
    setOtherUsersAC: (payload:{users:IFriend[]}) => ({type:GETOTHERUSERS,payload}),
    setFriendsAC: (payload:{users:IFriend[]}) => ({type:SETFRIENDS,payload}),
    setNewFriendAC: (payload:{userId:string}) => ({type:SETNEWFRIEND,payload}),
}


export default FriendsReducer

export interface IFriend {
    _id:string,
    firstName:string,
    surname:string,
    avatar:string
}
