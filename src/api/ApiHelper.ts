import axios from "axios";
import {AxiosResponse} from "axios";


const api = axios.create({
    baseURL: "/api",
});


export class ApiHelper{
    static post(path: string, body: any = null, accept_cookies: boolean = false): Promise<AxiosResponse>{
        if (accept_cookies){
            api.defaults.withCredentials = true;
        }
        return api.post('/v1' + path, body)
    }

    static get(path: string, accept_cookies: boolean = false): Promise<AxiosResponse>{
        if(accept_cookies){
            api.defaults.withCredentials = true;
        }
        return api.get('/v1' + path)
    }

    static delete(path: string): Promise<AxiosResponse>{
        return api.delete('/v1' + path)
    }
}