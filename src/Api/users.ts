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
    static async addToFriend(userId:string):Promise<IApiResponse> {
        try {
            const response = await instance.patch("users/friends",{
                userId
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

interface IGetUsersPayload {
    pageSize:number,
    page:number,
    search:string
}
interface IGetFriendsPayload extends IGetUsersPayload{
    userId:string
}