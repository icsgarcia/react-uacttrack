import { createContext } from "react";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    organization: {
        id: number;
        name: string;
        logo: string;
        logoUrl: string;
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    error: null,
});

export default AuthContext;
