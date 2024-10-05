import {useState} from "react";


export default function PaginatedTable({items, itemsPerPage=10}: any){
    console.log("Items", items)

    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = items.slice(startIndex, endIndex);
    const handleNext = () => {
        setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
    }

    const handlePrev = () => {
        setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
    }

    return <div className="relative flex w-full  flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
        <div className="bg-gray-200 rounded ">
            <div className="bg-gray-100 py-4">
                <div className="ml-8"> Paginate Annotations: {totalItems}</div>
            </div>
            {totalItems === 0 && <div className="h-12 ml-8 mt-4">
                No items
            </div>}
            {currentItems.map((item: any, index: number) => {
                return <>
                    <div key={index}>
                        {item}
                    </div>
                </>
            })}
        </div>
        <div className="w-full grid grid-cols-2 mb-24">
            <div className="flex justify-start">
               {currentPage > 1 && <button
                className="py-3 w-full bg-blue-500 text-white "
                onClick={handlePrev}>
                Prev
            </button>}</div>
             <div className="flex justify-end">
                {(totalItems > itemsPerPage && endIndex <= totalItems) && <button
                className=" py-3 w-full bg-blue-500 text-white"
                onClick={handleNext}>
                Next
            </button>}</div>
        </div>
    </div>
}
