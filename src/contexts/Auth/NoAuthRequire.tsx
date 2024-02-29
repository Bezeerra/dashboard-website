import {useContext, useEffect} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";


export const NoAuthRequire = ({ children }) => {

    const auth = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.user) {
            navigate('/');
        }
    }, []);

    return <div>
        {children}
    </div>
}