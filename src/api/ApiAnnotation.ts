import {ApiHelper} from "./ApiHelper.ts";


export class ApiAnnotation{
    static async getAnnotationByUser(user_id: string){
        return await ApiHelper.get(`/annotations/${user_id}`)
    }

    static async createAnnotation({user_id, title, text}: {user_id: string, title: string, text: string}) {
        return await ApiHelper.post('/annotations', {
            user_id: user_id,
            title: title,
            text: text
        })
    }

    static async deleteAnnotation({annotation_id}: {annotation_id: string}) {
        return await ApiHelper.delete(`/annotations/${annotation_id}`)
    }
}
