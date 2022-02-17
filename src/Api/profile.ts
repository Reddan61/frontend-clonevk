import instance from "./axios.settings"
import { IApiResponse } from "./interfacesApi"




export class ProfileApi {
    static async getAvatar(payload:{_id:string}):Promise<IApiResponse> {
        try {
            const response = await instance.get(`profile/avatar/${payload._id}`)

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
    static async setAvatar(payload:{base64Image:string}):Promise<IApiResponse> {
        try {
            const response = await instance.patch(`profile/avatar`, {
                image:payload.base64Image
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

    static async getAvatarUrl(payload:{public_id:string}):Promise<IApiResponse> {
        try {
            const response = await instance.get(`images`, {
                params: {
                    public_id:payload.public_id
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

    static async getProfileInfo(payload:{userId:string}):Promise<IApiResponse> {
        try {
            const response = await instance.get(`profile/info/${payload.userId}`)

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