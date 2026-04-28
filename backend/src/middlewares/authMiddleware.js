import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Authorization - Xác mình user là ai
export const protectedRoute = (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers["authorization"]; // Lấy authorization trong request headers mà client gửi lên
        const token = authHeader && authHeader.split(" ")[1]; // Nếu có authHeader -> tách chuỗi đó ra bằng dấu cách, sau khi tách -> Bearer <token>

        if (!token) {
            return res
                .status(401)
                .json({ message: "Không tìm thấy accessToken" });
        }

        // Xác nhận token hợp lệ
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decodedUser) => {
                if (err) {
                    console.error(err);
                    return res.status(403).json({
                        message: "accessToken hết hạn hoặc không đúng",
                    });
                }
                // Nếu token hợp lệ ->
                // Tìm user tương ứng
                const user = await User.findById(decodedUser.userId).select(
                    "-hashedPassword",
                ); // select.('hashedPassword') -> loại bỏ mật khẩu

                // Nếu không tìm thấy user
                if (!user) {
                    return res
                        .status(404)
                        .json({ message: "Người dùng không tồn tại" });
                }

                // Nếu tìm thấy user ->
                // Trả user về trong req
                req.user = user;
                next();
            },
        );
    } catch (error) {
        console.error("Lỗi khi xác mình JWT trong authMiddleware", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
// next là hàm callback dùng trong middleware của express
// khi gọi hàm next, express hiểu là chuyển tiếp luồng xử lý sang bước kế tiếp của middleware
