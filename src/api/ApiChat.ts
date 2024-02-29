import {AxiosResponse} from "axios";
import {ApiHelper} from "./ApiHelper.ts";


export class ApiChat{
    static async getHistory(receiver: string, sender: string): Promise<AxiosResponse> {
        return await ApiHelper.get(`/chat/history/${receiver}/${sender}`);
    }
}