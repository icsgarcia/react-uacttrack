import axios from "@/api/axios";
import { useEffect, useState, type ReactNode } from "react";
import {
    AuthContext,
    type AuthContextType,
    type LoginData,
    type RegisterData,
    type User,
} from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Call profile endpoint - cookie sent automatically
                const { data } = await axios.get("/auth/profile");
                setUser(data.user);
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setIsLoading(false); // ✅ Always set loading to false
            }
        };

        checkAuth();
    }, []);

    const login = async ({ email, password }: LoginData) => {
        try {
            const { data } = await axios.post("auth/login", {
                email,
                password,
            });
            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async ({
        firstName,
        lastName,
        email,
        organizationId,
        password,
    }: RegisterData) => {
        try {
            await axios.post("auth/register", {
                firstName,
                lastName,
                email,
                organizationId,
                password,
            });
            await login({ email, password });
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
        }
    };

    const isRole = (roles: string | string[]): boolean => {
        if (!user) return false;

        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        register,
        logout,
        isRole,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
