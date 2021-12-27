import { AnyAction } from "redux"


const intitalState = {
    isAuth:false
}

const LoginReducer = (state = intitalState,action:AnyAction) => {
    switch(action.type) {
        default:
            return state
    }
}


export default LoginReducer