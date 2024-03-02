import {Form, Input, SubmitButton, TextArea} from "../Utils/DefaultComponents.tsx";
import {useForm} from "react-hook-form";
import {ApiAnnotation} from "../../api/ApiAnnotation.ts";
import {User} from "../../types/User.ts";
import {useQueryClient} from "react-query";
import {useConfirmDialog} from "../Utils/ConfirmSubmit.tsx";
import {AxiosError} from "axios";
import {handleHookFormErrors} from "../Utils/handleErrors.ts";


interface AnnotationFormProps{
    user_id: string
    title: string
    text: string
}


export default function AnnotationForm({user}: {user: User}) {

    const methods = useForm<AnnotationFormProps>();
    const {setError} = methods;
    const classInput = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    const classLabel = "block text-gray-700 text-sm font-bold mb-2 text-left px-3 pt-2"
    const queryClient = useQueryClient();
    const { requestConfirm } = useConfirmDialog();

    const onSubmit = (data: any) => {
        const submitAnnotation = () => {
            ApiAnnotation.createAnnotation({
                user_id: user?.id!,
                title: data.title,
                text: data.text
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

    return <>
        <div className=" ">
            <Form methods={methods} onSubmit={onSubmit}
                className="bg-white  shadow-md rounded px-8 pt-6 pb-8  mb-4">
                <div className="mb-4">
                    <Input name='title' label={"Title"} classInput={classInput} type="text"
                           classLabel={classLabel} placeholder="Title Annotation"/>
                    <TextArea name='text' label={"Text"} classInput={classInput} type="text"
                           classLabel={classLabel} placeholder="Text Annotation"/>
                    <div className="w-full flex justify-end">
                        <SubmitButton className=" ">Create Annotation </SubmitButton>
                    </div>
                </div>
            </Form>
        </div>
    </>
}