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
            console.log(response)
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

export interface ICreatePostPayload {
    userId:string,
    text:string,
    images:Array<ArrayBuffer>
}