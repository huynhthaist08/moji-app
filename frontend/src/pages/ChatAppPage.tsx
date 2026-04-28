import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const ChatAppPage = () => {
    const user = useAuthStore((s) => s.user); // chỉ lấy đúng trường user trong store -> tránh theo dõi toàn bộ store gây rerender app -> component chỉ render khi user thay đổi

    const handleOnClick = async () => {
        try {
            await api.get("/users/test", { withCredentials: true });
            toast.success("Ok");
        } catch (error) {
            console.error(error);
            toast.error("Thất bại");
        }
    };

    return (
        <div>
            {user?.username}
            <Logout />

            <Button onClick={handleOnClick}>Test</Button>
        </div>
    );
};

export default ChatAppPage;
