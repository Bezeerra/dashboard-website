import {useGetAnnotations} from "../../api/hooks/Annotations.tsx";
import AnnotationForm from "./Form.tsx";
import {User} from "../../types/User.ts";
import PaginatedTable from "../Utils/Paginatios.tsx";
import {useConfirmDialog} from "../Utils/ConfirmSubmit.tsx";
import {ApiAnnotation} from "../../api/ApiAnnotation.ts";
import {useQueryClient} from "react-query";


function AnnotationCard({ annotation, onDelete }: any) {
  return (
    <div
      key={annotation.id}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {annotation.title}
        </h2>
        <button
          aria-label="Delete annotation"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(annotation.id)}
        >
          {/* SVG icon */} X
        </button>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {annotation.text}
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-end">
        {new Date(annotation.updated_at).toLocaleString()}
      </div>
    </div>
  );
}

export default function RowAnnotations({user}: {user: User, renderAnnotations: boolean}) {

    const {requestConfirm} = useConfirmDialog();

    const { data, isLoading } = useGetAnnotations({ user_id: user.id });
    const dataAnnotations = data?.data?.annotations;

    const  queryClient = useQueryClient()

    if (isLoading) return <div>Loading...</div>;

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
      if (!dataAnnotations || dataAnnotations.length === 0) {
        return (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No annotations found.
          </div>
        );
      }

      return dataAnnotations.map((annotation: any) => (
        <AnnotationCard
          key={annotation.id}
          annotation={annotation}
          onDelete={deleteAnnotation}
        />
      ));
    };


    return <>
        <div className="justify-center">
            <div className="mt-12 md:mt-28 w-5/6 mx-auto md:mx-24 ml-7 md:ml-48">
                <AnnotationForm user={user}/>
            </div>
            <div className="w-5/6 mx-auto md:mx-24 ">
                <PaginatedTable items={loadAnnotations()} itemsPerPage={5}/>
            </div>
        </div>
        </>
}
