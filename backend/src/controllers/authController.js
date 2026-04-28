import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; //thường là dưới 15minute
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14day

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message:
                    "Không thể thiếu username, password, email, firstName, và lastName",
            });
        }

        // Kiểm tra user tồn tại chưa
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res.status(409).json({ message: "username đã tồn tại" });
        }

        // Mã hoá password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

        // Tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        // Return
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signIn = async (req, res) => {
    try {
        // Lấy input từ req body
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Thiếu username hoặc password" });
        }
        // Lấy hashedPassword trong db để so với password input
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({ message: "username hoặc password không chính xác" });
        }

        // Kiểm tra password
        const passwordCorrect = await bcrypt.compare(
            password,
            user.hashedPassword,
        );

        if (!passwordCorrect) {
            return res
                .status(401)
                .json({ message: "username hoặc password không chính xác" });
        }

        // Nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL },
        );

        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // Tạo session mới để lưu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // Trả refresh token về trong cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // cho phép backend và frontend chạy trên 2 domain khác nhau (deploy riêng)
            maxAge: REFRESH_TOKEN_TTL,
        });

        // Trả access token về trong res
        return res.status(200).json({
            message: `User ${user.displayName} đã logged in!`,
            accessToken,
        });
    } catch (error) {
        console.error("Lỗi khi gọi signIp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signOut = async (req, res) => {
    try {
        // Lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;

        if (!token) {
            // Xoá refreshToken trong session
            await Session.deleteOne({ refreshToken: token });

            // Xoá refreshToken trong cookie
            res.clearCookie("refreshToken"); // xoá cookie trong trình duyệt, đảm bảo người dùng ko còn token nào lưu lại trong client
        }
        return res.sendStatus(204); // 204: Yêu cầu xử lý thành công -> ko gửi trả lại dữ liệu
    } catch (error) {
        console.error("Lỗi khi gọi signout", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
