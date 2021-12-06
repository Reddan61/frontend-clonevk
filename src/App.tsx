import React from "react"
import { Routes, Route } from "react-router-dom"
import Auth from "@/components/Auth/Auth"
import HeaderLayout from "@/components/Header/HeaderLayout"

const App:React.FC = () => {
    return <Routes>
        <Route path = "/auth" element = {<HeaderLayout><Auth /></HeaderLayout>} />
    </Routes>
}

export default App