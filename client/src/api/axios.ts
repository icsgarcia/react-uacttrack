import axios from "axios";

const LOCAL_BASE_URL = "http://localhost:3000";

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL || LOCAL_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
    withCredentials: true,
});

// Response interceptor for token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token expired, refresh it
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint (both cookies sent automatically)
                await axios.post(
                    `${
                        import.meta.env.VITE_API_URL || LOCAL_BASE_URL
                    }/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // New access token cookie is set by server
                // Just retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
