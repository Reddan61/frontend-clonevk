import axios, { AxiosRequestConfig } from "axios"

const instance = axios.create({
    baseURL: process.env.BACKEND_URL
})

instance.interceptors.request.use(function (config:AxiosRequestConfig) {
    config.headers!.Authorization = "Bearer " + localStorage.getItem('vk-clone-token')

    return config
})

export default instance