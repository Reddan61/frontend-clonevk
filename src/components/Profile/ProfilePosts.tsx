import { PostsApi } from "@/Api/posts"
import { IPost, postsActions } from "@/store/PostsReducer"
import { useAppSelector } from "@/store/store"
import { userInfoActions } from "@/store/UserInfoReducer"
import { isMongoDBId } from "@/utils/isMongoDBId"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"
import Post from "../Post/Post"


const ProfilePosts:React.FC = () => {
    const { userId } = useAppSelector(state => state.login)
    const { posts } = useAppSelector(state => state.posts)
    
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ pageNumber, setPageNumber ] = useState(1)
    const [ isLoading, setLoading ] = useState(false)
    const [ totalPages, setTotalPages ] = useState(0)

    const observerRef = useRef<HTMLDivElement>(null)
    const isLoadingRef = useRef(isLoading)
    isLoadingRef.current = isLoading

    useEffect(() => {
        (async function() {
            const _id =  searchParams.get("id") ? searchParams.get("id") : userId
            if(!isMongoDBId(_id)) {
                navigate("/auth/login",{
                    replace:true
                })
                return 
            }
            await getProfilePosts(_id)
        })()
    },[searchParams.get("id")])
    
    useEffect(() => {
        (async function() {
            if(pageNumber <= 1)
                return
            const _id =  searchParams.get("id") ? searchParams.get("id") : userId
            const response = await getPosts(_id)
            if(response.message === "success")
                dispatch(postsActions.setPosts([...posts,...response.payload.posts]))
            setLoading(false)
        })()
    },[pageNumber])

    useEffect(() => {
        const target = observerRef.current
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting && !isLoadingRef.current && totalPages > pageNumber) {
                setLoading(true)
                setPageNumber(pageNumber + 1)
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

    async function getProfilePosts(id:string) {
        const postsResponse = await getPosts(id)
        if(postsResponse.message === "success") {
            setTotalPages(postsResponse.payload.totalPages)
            dispatch(postsActions.setPosts(postsResponse.payload.posts))
        }
    }

    async function getPosts(id:string) {
        const postsResponse = await PostsApi.getUserPosts(id,pageNumber)
        return postsResponse
    }

    return <> 
    {
        posts.length > 0 && posts.map((el:IPost) => {
            return <Post key = {el._id} post = {el}/>
        })
    }

    <div ref = {observerRef} style={{width:"100%",height:"1px"}}></div>
    </>
}


export default ProfilePosts