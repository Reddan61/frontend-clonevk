import React from "react"
import { useNavigate } from "react-router"
import Friends from "../svg/Friends"
import News from "../svg/News"
import Profile from "../svg/Profile"
import classes from "./SideBar.module.scss"

const SideBar:React.FC = () => {
    const navigate = useNavigate()

    return <div className={classes.sidebar}>
        <ul>
            <li onClick = {() => {
                navigate("/profile",{
                    replace:true
                })
            }}>
                <Profile width={20} height={20} color="#5181b8"/>
                <span>Моя страница</span>
            </li>
            <li onClick = {() => {
                navigate("/news",{
                    replace:true
                })
            }}>
                <News width={20} height={20} color="#5181b8"/>
                <span>Новости</span>
            </li>
            <li onClick = {() => {
                navigate("/friends",{
                    replace:true
                })
            }}>
                <Friends width={20} height={20} color="#5181b8"/>
                <span>Друзья</span>
            </li>
        </ul>
    </div>
}


export default SideBar