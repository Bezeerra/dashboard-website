import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";


export default function MyAccount() {

    const {user} = useContext(AuthContext);

    return (
        <div>
            <p className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Account {user && user.email}
            </p>
        </div>
    )

}