import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "@/components/Auth/Auth"
import HeaderLayout from "@/components/Header/HeaderLayout"
import Email from "@/components/Auth/Email/Email"
import Login from "@/components/Auth/Login/Login"
import Profile from "./components/Profile/Profile"
import Friends from "./components/Friends/Friends"
import News from "./components/News/News"

const App:React.FC = () => {
    return <Routes>
        <Route path = "auth" element = {<HeaderLayout />}>
            <Route index element = {<Auth />} /> 
            <Route path = "email" element = {<Email/>} />
            <Route path = "login" element = {<Login/>} />
        </Route>
        <Route path = "profile" element = {<HeaderLayout />}>
            <Route index element = {<Profile />} /> 
        </Route>
        <Route path = "friends" element = {<HeaderLayout />}>
            <Route index element = {<Friends />} /> 
        </Route>
        <Route path = "news" element = {<HeaderLayout />}>
            <Route index element = {<News />} /> 
        </Route>
        <Route path="*" element={<Navigate to={"/auth"} replace/>} />
    </Routes>
}

export default App