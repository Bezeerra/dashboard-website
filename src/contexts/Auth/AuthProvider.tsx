import {AuthContext} from "./AuthContext.tsx";
import {useEffect, useState} from "react";
import {User} from "../../types/User.ts";
import {ApiUser} from "../../api/ApiUser.ts";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken().finally(() => setLoading(false));
    }, []);

    const validateToken = async () => {
        const token = getToken();
        if (token) {
            try {
                const res = await ApiUser.validateToken(token);
                console.log("Token is Valid");
                setUser(res.data.user);
                return res.data.user;
            } catch (err) {
                console.log("Token is Invalid", err);
                await setToken('');
                setUser(null);
                return null;
            }
        }
        return null;
    };

    const setToken = async (token: string) => {
        localStorage.setItem('authToken', token);
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, setToken, getToken, validateToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};




