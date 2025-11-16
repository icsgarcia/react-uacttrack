import { createContext } from "react";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    role: "STUDENT" | "HEAD" | "OSA" | "VPA" | "VPAA";
    email: string;
    organizationId: {
        _id: string;
        name: string;
        logo: string;
    };
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isRole: (roles: string | string[]) => boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    organizationId: string;
    password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
