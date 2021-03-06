import instance from "./axios.settings"
import { IApiResponse } from "./interfacesApi"


export class UsersApi {
    static async getUsers(payload:IGetUsersPayload):Promise<IApiResponse> {
        try {
            const response = await instance.get("users",{
                params: payload
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
    static async getFriends(payload:IGetFriendsPayload):Promise<IApiResponse> {
        try {
            const response = await instance.get("users/friends",{
                params: payload
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
    
    static async isFriend(userId:string):Promise<IApiResponse> {
        try {
            const response = await instance.get("users/isfriend",{
                params: {
                    userId
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
    static async deleteFriend(userId:string):Promise<IApiResponse> {
        try {
            const response = await instance.delete("users/friends",{
                data: {
                    userId
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
}

interface IGetPayload {
    pageSize:number,
    page:number
}


interface IGetUsersPayload extends IGetPayload {
    search:string
}

interface IGetFriendsPayload extends IGetUsersPayload{
    userId:string
}