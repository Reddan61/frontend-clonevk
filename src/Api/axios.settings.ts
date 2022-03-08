import axios, { AxiosRequestConfig } from "axios"
import config from "@/config/config"


const instance = axios.create({
    baseURL: config.backend_url
})

instance.interceptors.request.use(function (config:AxiosRequestConfig) {
    config.headers!.Authorization = "Bearer " + localStorage.getItem('vk-clone-token')

    return config
})

export default instance