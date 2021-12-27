import { AnyAction } from "redux"

const SETID = "SETREGISTERID"


const initialState = {
    _id:null as string | null
}


const RegisterReducer = (state = initialState,action:AnyAction) => {
    switch(action.type) {
        case SETID: 
            return {
                ...state,
                _id:action.payload._id
            }
        default:
            return state
    }
}

export const registerActions = {
    setIdAC: (_id:string | null) => ({type:SETID,payload:{_id}})
}


export default RegisterReducer