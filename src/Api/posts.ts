import instance from "./axios.settings";
import { IApiResponse } from "./interfacesApi";

export class PostsApi {
    static async create(payload:ICreatePostPayload):Promise<IApiResponse> {
        try {
            const response = await instance.post(`posts/create`,payload)
            
            return {
                message:"success",
                payload: {
                    ...response.data.payload
                }
            }
        }
        catch(e:any) {
            return {
                message:"error",
                payload: {}
            }
        }
    }

    static async getUserPosts(userId:string,page = 1):Promise<IApiResponse> {
        try {
            const response = await instance.get(`posts/user`,{
                params : {
                    userId,
                    page
                }
            })

            return {
                message:"success",
                payload: {
                    ...response.data.payload
                }
            }
        }
        catch(e:any) {
            return {
                message:"error",
                payload: {}
            }
        }
    }

    static async isLiked(postId:string):Promise<IApiResponse> {
        try {
            const response = await instance.get(`posts/like`,{
                params : {
                    postId
                }
            })

            return {
                message:"success",
                payload: {
                    ...response.data.payload
                }
            }
        }
        catch(e:any) {
            return {
                message:"error",
                payload: {}
            }
        }
    }
    static async getFriendsPosts(payload:IGetFriendsPostsPayload):Promise<IApiResponse> {
        try {
            const response = await instance.get(`posts/friends`,{
                params : {
                    ...payload
                }
            })

            return {
                message:"success",
                payload: {
                    ...response.data.payload
                }
            }
        }
        catch(e:any) {
            return {
                message:"error",
                payload: {}
            }
        }
    }
    static async setLike(postId:string):Promise<IApiResponse> {
        try {
            const response = await instance.patch(`posts/like`,{
                postId
            })

            return {
                message:"success",
                payload: {
                    ...response.data.payload
                }
            }
        }
        catch(e:any) {
            return {
                message:"error",
                payload: {}
            }
        }
    }
}

export interface IGetFriendsPostsPayload {
    userId:string,
    pageSize:number,
    page:number
}

export interface ICreatePostPayload {
    userId:string,
    text:string,
    images:Array<string>
}