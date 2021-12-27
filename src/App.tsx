import React from "react"
import { Routes, Route } from "react-router-dom"
import Auth from "@/components/Auth/Auth"
import HeaderLayout from "@/components/Header/HeaderLayout"
import Email from "@/components/Auth/Email/Email"
import Login from "@/components/Auth/Login/Login"

const App:React.FC = () => {
    return <Routes>
        <Route path = "auth" element = {<HeaderLayout />}>
            <Route index element = {<Auth />} /> 
            <Route path = "email" element = {<Email/>} />
            <Route path = "login" element = {<Login/>} />
        </Route>
        <Route path = "profile" element = {<HeaderLayout />}>
            <Route index element = {<div>Profile Page</div>} /> 
        </Route>
    </Routes>
}

export default App