import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(
                    `${
                        import.meta.env.VITE_API_URL || "http://localhost:3000"
                    }/auth/refresh-token`,
                    { refreshToken }
                );

                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
