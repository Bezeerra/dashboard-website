import {ApiHelper} from "./ApiHelper.ts";
import {AxiosResponse} from "axios";
import {User} from "../types/User.ts";


export class ApiUser {
    static async createUser(user: User): Promise<AxiosResponse> {
        return await ApiHelper.post('/users', user);
    }

    static async validateToken(token: string): Promise<AxiosResponse> {
        return await ApiHelper.post(
            '/users/validate_token',
            {token: token},
            true
        )
    }

    static async signIn({email, password}: {email: string, password: string}): Promise<AxiosResponse> {
        return await ApiHelper.post(
            '/users/sign_in',
            {email: email, password: password},
            true
        )
    }

    static async singOut(token: string): Promise<AxiosResponse> {
        return await ApiHelper.post('/users/sign_out', {token: token})
    }


    static async getUsers() {
        return await ApiHelper.get('/users/all_users')
    }
}
