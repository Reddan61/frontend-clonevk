import { AnyAction } from "redux"

const LOGIN = "LOGIN/LOGIN"
const LOGOUT = "LOGIN/LOGOUT"


const intitalState = {
    isAuth:false,
    userId:null as string | null
}

const LoginReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        case LOGIN: 
            return {
                ...state,
                isAuth: true,
                userId: action.payload._id
            }
        case LOGOUT:
            localStorage.removeItem("vk-clone-token")
            return {
                ...state,
                isAuth:false,
                userId:null
            }
        default:
            return state
    }
}


export const loginActions = {
    loginAC:(_id:string) => ({type:LOGIN,payload:{_id}}),
    logoutAC: () => ({type:LOGOUT})
}


export default LoginReducer