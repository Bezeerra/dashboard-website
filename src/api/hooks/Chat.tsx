import {useQuery, UseQueryResult} from "react-query";
import {ApiChat} from "../ApiChat.ts";


export const getHistoryChat = ({receiver, sender}: {receiver: string, sender: string}): UseQueryResult<any> => {
    return useQuery(["historyChat"], async () => {
        const res = await ApiChat.getHistory(receiver, sender)
        return res.data
    });
}