import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";
import {useContext} from "react";
import RowAnnotations from "./RowAnnotations.tsx";


export default function Annotations(){
    const {user} = useContext(AuthContext)
    if (!user) return <></>
    if (user) {
        return <>
            <RowAnnotations user={user!}/>
        </>
    }
}