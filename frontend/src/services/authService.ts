import api from "@/lib/axios";

export const authService = {
    signUp: async (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ) => {
        const res = await api.post(
            "/auth/signup",
            {
                username,
                password,
                email,
                firstName,
                lastName,
            },
            { withCredentials: true },
        );

        // lấy dữ liệu trả về
        return res.data;
    },

    signIn: async (username: string, password: string) => {
        const res = await api.post(
            "/auth/signin",
            {
                username,
                password,
            },
            { withCredentials: true },
        );

        // lấy dữ liệu trả về
        return res.data; // data: accessToken
    },

    signOut: async () => {
        return api.post("/auth/signout", { withCredentials: true });
    },

    fetchMe: async () => {
        const res = await api.get("/users/me", { withCredentials: true });
        return res.data.user;
    },

    refresh: async () => {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        return res.data.accessToken;
    },
};
