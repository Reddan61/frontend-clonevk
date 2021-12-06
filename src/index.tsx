import "./index.scss"
import React from "react"
import ReactDom from "react-dom"
import App from "@/App"
import { BrowserRouter } from "react-router-dom"


const root = document.getElementById("root")

ReactDom.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
,root)