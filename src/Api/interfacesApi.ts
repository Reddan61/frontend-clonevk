export interface IApiResponse {
    message:"success" | "error",
    payload: {
        [name: string]: any
    }
}