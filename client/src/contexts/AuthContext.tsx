import { createContext } from "react";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    organizationId: number;
    Organization: {
        id: number;
        name: string;
        logo: string | null;
    };
    logoUrl: string | undefined;
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
    organizationId: number;
    password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
