import "./index.scss"
import React from "react"
import ReactDom from "react-dom"
import App from "@/App"
import { BrowserRouter, HashRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import config from "@/config/config"

const root = document.getElementById("root")

ReactDom.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    </React.StrictMode>
,root)