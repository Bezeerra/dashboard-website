import {useGetAnnotations} from "../../api/hooks/Annotations.tsx";
import AnnotationForm from "./Form.tsx";
import {User} from "../../types/User.ts";
import {useState} from "react";
import PaginatedTable from "../Utils/Paginatios.tsx";
import {useConfirmDialog} from "../Utils/ConfirmSubmit.tsx";
import {ApiAnnotation} from "../../api/ApiAnnotation.ts";
import {handleHookFormErrors} from "../Utils/handleErrors.ts";
import {useQueryClient} from "react-query";


export default function RowAnnotations({user}: {user: User, renderAnnotations: boolean}) {

    const {requestConfirm} = useConfirmDialog();

    const { data, error, isLoading } = useGetAnnotations({ user_id: user.id });
    const dataAnnotations = data?.data?.annotations;

    const  queryClient = useQueryClient()

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const deleteAnnotation = (annotation_id: string) => {
        const submitDelete = () => {
            ApiAnnotation.deleteAnnotation({annotation_id: annotation_id})
                .then(async (res) => {
                    console.log("Alert Successfully Deleted", res);
                }).catch((error) => {
                    console.log("ERROR", error.response);
                }).finally(async () => {
                   await queryClient.invalidateQueries("annotationsRow")
            })
        }

        return requestConfirm(() => submitDelete())
    }


    const loadAnnotations = () => {
        return dataAnnotations?.map((annotation: any, index) => {
            return <>
                <div className={"block bg-gray-100 p-2 m-4 my-2 "}
                key={annotation.text + index.toString()}>
                    <div className="flex grid grid-cols-2">
                        <div className="flex text-xl text-black">
                            {annotation.title}
                        </div>
                        <button className="flex justify-end mr-4 text-red-500" onClick={() => deleteAnnotation(annotation.id)}>
                            X
                        </button>
                    </div>
                    <div className="p-4 text-xl">
                        {annotation.text}
                    </div>
                    <div className="text-sm w-full flex justify-end">
                        {annotation.updated_at}
                    </div>
                </div>
            </>
        })
    }

    return <>
        <div className="justify-center">
            <div className="mt-28 w-4/6 ml-20 md:ml-48">
                <AnnotationForm user={user}/>
            </div>
            <div className="w-5/6 mx-auto md:mx-24 ">
                <PaginatedTable items={loadAnnotations()} itemsPerPage={5}/>
            </div>
        </div>
        </>
}