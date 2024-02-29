import { createContext } from "react";
import {User} from "../../types/User.ts";

export type AuthContextType = {
    user: User | null;
    setToken: (token: string) => any;
    getToken: () => string | null;
    validateToken: () => Promise<User | null>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);