import { IGetFriendsPostsPayload, PostsApi } from "@/Api/posts"
import { IPost, postsActions } from "@/store/PostsReducer"
import { useAppDispatch, useAppSelector } from "@/store/store"
import React, { useEffect, useRef, useState } from "react"
import withAuth from "../HOCs/withAuth"
import Post from "../Post/Post"
import SideBar from "../SideBar/SideBar"
import classes from "./News.module.scss"

interface IProps {
    isLoadingHOC?:boolean
}


const News:React.FC<IProps> = ({ isLoadingHOC }) => {
    const pageSize = 10
    
    const { userId } = useAppSelector(state => state.login)
    const { posts } = useAppSelector(state => state.posts)

    const dispatch = useAppDispatch()

    const [isLoading,setLoading] = useState(true)
    const [ isLoadingPagination, setLoadingPagination ] = useState(false)
    
    const [ page, setPage ] = useState(1)
    const [ totalPages, setTotalPages ] = useState(1)

    const isLoadingPaginationRef = useRef<boolean>(isLoadingPagination)
    const observerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const target = observerRef.current
        if(!target) 
            return
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingPaginationRef.current && totalPages > page) {
                setLoadingPagination(true)
                setPage(page + 1)
            }
        },{
            root:null,
            rootMargin:'0px',
            threshold:0.1
        })
        if(target) {
            observer.observe(target)
        }
        return () => {
            if(target)
                observer.unobserve(target)
        }
    },[observerRef.current,posts])

    useEffect(() => {
        (async function() {
            if(isLoadingHOC)
                return
            const payload:IGetFriendsPostsPayload = {
                userId,
                page,
                pageSize
            }
            const response = await PostsApi.getFriendsPosts(payload)

            if(response.message === "success" && page <= 1) {
                dispatch(postsActions.setPosts([...response.payload.posts]))
                setTotalPages(response.payload.totalPages)
            }
            else if(response.message === "success" && page > 1){
                dispatch(postsActions.setPosts([...posts,...response.payload.posts]))
                setTotalPages(response.payload.totalPages)
            }
            setLoading(false)
            setLoadingPagination(false)
        })()
    },[page, isLoadingHOC])

    return <div className={classes.news}>
        <div className={classes.news__container}>
            <div className={classes.news__sidebar}>
                <SideBar dontClick = {isLoading || isLoadingHOC}/>
            </div>
            <div className={classes.news__body}>
                {
                    isLoading || posts.map((el:IPost) => {
                        return <Post key = {el._id} post={el}/>
                    })
                }
                {
                    isLoading || <div ref={observerRef} className={classes.observer}></div>
                }
            </div>
        </div>
    </div>
}


export default withAuth(News)