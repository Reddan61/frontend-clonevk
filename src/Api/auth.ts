import instance from "./axios.settings"




export class AuthApi {
    static async preRegister(payload:IPreRegisterPayload):Promise<IApiResponse> {
        try {
            const response = await instance.post("auth/preRegister",payload)

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

    static async sendEmail(payload:ISendEmailPayload) {
        try {
            const response = await instance.patch("auth/send",payload)

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

    static async verifyEmail(payload:IVerifyEmailPayload) {
        try {
            const response = await instance.patch("auth/verify",payload)
            
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

    static async setPassword(payload:ISetPasswordPayload) {
        try {
            const response = await instance.patch("auth/setpassword",payload)

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

    static async login(payload:ILoginPayload) {
        try {
            const response = await instance.post("auth/login",payload)

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

    static async me() {
        try {
            const response = await instance.post("auth/me")

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


export interface ISendEmailPayload {
    _id:string,
    email:string
}


export interface IVerifyEmailPayload {
    _id:string,
    code:string
}

export interface ISetPasswordPayload {
    _id:string,
    password:string
}

export interface ILoginPayload {
    email:string,
    password:string
}

interface IApiResponse {
    message:"success" | "error",
    payload: {
        [name: string]: any
    }
}

export interface IPreRegisterPayload {
    firstName:string,
    surname:string,
    birthday: {
        day:string,
        month:string,
        year:string
    }
}