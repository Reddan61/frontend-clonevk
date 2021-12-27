import "./index.scss"
import React from "react"
import ReactDom from "react-dom"
import App from "@/App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"


const root = document.getElementById("root")

ReactDom.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
,root)