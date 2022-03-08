import React from "react"
import { useNavigate } from "react-router"
import Friends from "../svg/Friends"
import News from "../svg/News"
import Profile from "../svg/Profile"
import classes from "./SideBar.module.scss"

interface IProps {
    dontClick?:boolean
}

const SideBar:React.FC<IProps> = ({ dontClick }) => {
    const navigate = useNavigate()

    return <div className={classes.sidebar}>
        <ul>
            <li onClick = {() => {
                if(!dontClick)
                navigate("/profile",{
                    replace:true
                })
            }}>
                <Profile width={20} height={20} color="#5181b8"/>
                <span>Моя страница</span>
            </li>
            <li onClick = {() => {
                if(!dontClick)
                navigate("/news",{
                    replace:true
                })
            }}>
                <News width={20} height={20} color="#5181b8"/>
                <span>Новости</span>
            </li>
            <li onClick = {() => {
                if(!dontClick)
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