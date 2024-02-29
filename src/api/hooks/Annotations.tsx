import {useQuery, UseQueryResult} from "react-query";
import {ApiAnnotation} from "../ApiAnnotation.ts";
import {Annotation} from "../../types/Annotations.ts";


export const useGetAnnotations = ({user_id}: {user_id: string}): UseQueryResult<{data: {annotations: Annotation[]}}> => {
    return useQuery(["annotationsRow"], async () => {
        return await ApiAnnotation.getAnnotations({user_id})
    });
}