import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { combineReducers, createStore } from "redux"
import LoginReducer from "./LoginReducer"
import RegisterReducer from "./RegisterReducer"
import UserInfoReducer from "./UserInfoReducer"

const reducers = combineReducers({
    register:RegisterReducer,
    login:LoginReducer,
    userinfo:UserInfoReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = createStore(reducers)