import React from "react"
import Chat from "../svg/Chat"
import News from "../svg/News"
import Profile from "../svg/Profile"
import classes from "./SideBar.module.scss"

const SideBar:React.FC = () => {
    return <div className={classes.sidebar}>
        <ul>
            <li>
                <Profile width={20} height={20} color="#5181b8"/>
                <span>Моя страница</span>
            </li>
            <li>
                <News width={20} height={20} color="#5181b8"/>
                <span>Новости</span>
            </li>
            <li>
                <Chat width={20} height={20} color="#5181b8"/>
                <span>Мессенджер</span>
            </li>
        </ul>
    </div>
}


export default SideBar