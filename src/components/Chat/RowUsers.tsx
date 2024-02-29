import {useGetUsers} from "../../api/hooks/Users.tsx";
import {useContext, useState} from "react";
import {User} from "../../types/User.ts";
import Chat from "./Chat.tsx";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";

export default function RowUsers(){

    const [toUser, setToUser] = useState<string>('');
    const {user } = useContext(AuthContext)
    const {data, error, isLoading} = useGetUsers();
    const users = data?.data.users;
    if(error){
        console.log(error)
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    function NewChat({user}: {user: User}) {
        return <>
            <button key={user.id} className={"text-white w-full bg-blue-500 hover:bg-blue-700 py-3 px-8 rounded disabled"}
                       onClick={() => setToUser(user.id!)}>
                <p>{user.name}</p>
            </button>
        </>
    }


    return (
        <div className="sm:flex-col md:grid md:grid-cols-2  w-full">
            <div className="">
                <p className="px-4 py-4 text-xl ">Usuários logados: </p>
                {users?.map((userRow: User) => <div className="pt-4">
                    {userRow.id != user?.id ? <NewChat user={userRow}/> : <></>}
                </div>)}
            </div>
            <div className="bg-gray-200 mt-16 h-64">
                {toUser && <div className="" key={toUser}>
                    <Chat toUser={toUser}/>
                </div>}
            </div>
        </div>
    )


}