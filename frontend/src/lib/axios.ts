import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5001/api"
            : "/api",
    withCredentials: true, // nếu ko có dòng này thì cookie sẽ ko được gửi lên gg -> user bị logout liên tục
});

// Interceptors
// Tự động gắn accessToken vào req headers
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Tự động gọi refresh api khi accessToken hết hạn
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Những api không cần check
        if (
            originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            console.log("Refresh", originalRequest);

            try {
                const res = await api.post("/auth/refresh", {
                    withCredentials: true,
                });
                const newAccessToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearState();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

export default api;

// baseURL tự động đổi theo môi trường, nếu đang code local sẽ gọi server ở localhost, còn khi deploy lên production thì dùng chung domain với backend
// -> nếu app đang chạy ở chế độ development thì axios sẽ gửi request đến http://localhost:5001/api, ngược lại khi build production sẽ gọi /api
