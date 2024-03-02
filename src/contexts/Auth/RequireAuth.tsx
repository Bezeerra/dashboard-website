import {useContext, useEffect} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";


export const RequireAuth = ({ children }: any) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.loading) {
            if (!auth.user) {
                navigate('/login');
            }
        }
    }, [auth.user, auth.loading, navigate]);

    if (auth.loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            {children}
        </div>
    );
};
