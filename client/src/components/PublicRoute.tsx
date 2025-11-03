import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // If already logged in, redirect to dashboard
    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
