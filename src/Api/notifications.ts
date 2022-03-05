import instance from "./axios.settings"
import { IApiResponse } from "./interfacesApi"


export class NotificationsApi {
    static async sendFriendInvite(userId:string):Promise<IApiResponse> {
        try {
            const response = await instance.post("notifications/",{
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
    static async acceptInviteFriend(notificationId:string):Promise<IApiResponse> {
        try {
            const response = await instance.patch("notifications/",{
                notificationId
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
    static async setIsReadNotification(notificationId:string):Promise<IApiResponse> {
        try {
            const response = await instance.patch("notifications/read",{
                notificationId
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
    static async getNotifications(payload:IGetPayload):Promise<IApiResponse> {
        try {
            const response = await instance.get("notifications",{
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

    static async getTotalNotReadNotifications():Promise<IApiResponse> {
        try {
            const response = await instance.get("notifications/notread")

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
