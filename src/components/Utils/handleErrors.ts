import {AxiosError} from "axios";

interface ErrorFromApi {
    loc: string[];
    msg: string
    type?: string
    input: string
    ctx?: {}
}


export const handleHookFormErrors = (response: AxiosError | any, setError: any) => {
    const data = response.response?.data?.detail

    if (data){
        data?.forEach((error: ErrorFromApi) => {
            error?.loc.forEach((loc: string) => {
                if (loc !== "body") {
                    setError(loc, {type: error?.type || "manual", message: error?.msg})
                }
            })
        })
    }
}