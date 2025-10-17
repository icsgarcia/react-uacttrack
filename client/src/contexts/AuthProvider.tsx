import { useEffect, useState, type ReactNode } from "react";
import AuthContext, { type User } from "./AuthContext.tsx";
import api from "@/api/axios.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await api.get(`/auth/profile`);
                setUser(response.data.user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Authentication check failed:", error);

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken)
                        throw new Error("No refresh token available");

                    const response = await api.post(`/auth/refresh-token`, {
                        refreshToken,
                    });

                    localStorage.setItem(
                        "accessToken",
                        response.data.accessToken
                    );
                    localStorage.setItem(
                        "refreshToken",
                        response.data.refreshToken
                    );

                    const profileResponse = await api.get(`/auth/profile`);
                    setUser(profileResponse.data.user);
                    setIsAuthenticated(true);
                } catch (refreshError) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        try {
            setError(null);
            const response = await api.post(`/auth/login`, {
                email,
                password,
            });
            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            throw error;
        }
    };

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        try {
            setError(null);
            await api.post(`/auth/register`, {
                firstName,
                lastName,
                email,
                password,
            });

            await login({ email, password });
        } catch (error) {
            setError("Registration failed. Please try again.");
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await api.post(`/auth/logout`, { refreshToken });
            }
        } catch (error) {
            setError("Logout failed. Please try again.");
            throw error;
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        error,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
