import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.tsx";
import Login from "../../components/Login/Login.tsx";
import {useNavigate} from "react-router-dom";


export const RequireAuth = ({ children }) => {
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
