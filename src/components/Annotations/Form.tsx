
// @ts-ignore
import {Form, Input, SubmitButton, TextArea} from "../Utils/DefaultComponents.tsx";
import {set, useForm} from "react-hook-form";
import {ApiAnnotation} from "../../api/ApiAnnotation.ts";
import {User} from "../../types/User.ts";
import {useQueryClient} from "react-query";
import {useConfirmDialog} from "../Utils/ConfirmSubmit.tsx";
import {AxiosError} from "axios";
import {handleHookFormErrors} from "../Utils/handleErrors.ts";
import Editor from "../../utils/Editor.tsx";
import {useState} from "react";


interface AnnotationFormProps{
    user_id: string
    title: string
    text: string
}


export default function AnnotationForm({user}: {user: User}) {

    const methods = useForm<AnnotationFormProps>();
    const {setError} = methods;
    const queryClient = useQueryClient();
    const {requestConfirm} = useConfirmDialog();
    const [content, setContent] = useState({})



    const onSubmit = (data: any) => {
        const submitAnnotation = () => {
            ApiAnnotation.createAnnotation({
                user_id: user.id!,
                title: data.title,
                text: content
            }).then(async () => {
                await queryClient.invalidateQueries("annotationsRow")
            }).catch((error: AxiosError) => {
                handleHookFormErrors(error, setError)
            }).finally(async () => {
                console.log("Finally")
            })
        }
        return requestConfirm(() => submitAnnotation())
    }

    return (
        <>
            <div className="flex justify-center items-center dark:bg-gray-900 p-4">
                <Form
                    methods={methods}
                    onSubmit={onSubmit}
                    className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-10"
                >
                    <div className="mb-6">
                        <Input
                            name="title"
                            label="Title"
                            classInput="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            classLabel="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                            placeholder="Title Annotation"
                        />
                    </div>
                    <div className="mb-6">
                        <Editor setContent={(editor) => setContent(editor)} />
                    </div>
                    <div className="w-full flex justify-end">
                        <SubmitButton
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
                            Create Annotation
                        </SubmitButton>
                    </div>

                </Form>
            </div>
        </>
    )
}
