import axios from "axios";

const LOCAL_BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: import.meta.env.API_URL || LOCAL_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
    withCredentials: true,
});

export default axiosInstance;
