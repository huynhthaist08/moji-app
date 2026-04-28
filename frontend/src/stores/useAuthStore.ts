import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

// Zustand store

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false, // theo dõi trạng thái khi gọi API

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

    // Hàm này reset toàn bộ state về giá trị mặc định
    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            // Gọi API
            await authService.signUp(
                username,
                password,
                email,
                firstName,
                lastName,
            );

            toast.success(
                "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập",
            );
        } catch (error) {
            console.error(error);
            toast.error("Đăng ký không thành công");
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(
                username,
                password,
            );
            get().setAccessToken(accessToken);

            // Lấy thông tin người dùng sau khi login
            await get().fetchMe();

            toast.success("Chào mừng bạn quay lại với Moji!");
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập không thành công");
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xảy ra khi đăng xuất! Hãy thử lại");
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();

            set({ user }); // khi đã có user -> cập nhật store (user)
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng! Hãy thử lại");
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error(error);
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
            get().clearState();
        } finally {
            set({ loading: false });
        }
    },
}));

// create -> tạo một global store (state + logic) mà component nào cũng dùng được
// set -> dùng để update state
// get -> dùng để lấy state trong store

// Zustand store = 1 obj gồm {
// state (accessToken, user, loading)
// action (signUp)
// }
