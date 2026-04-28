import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        hashedPassword: {
            // field này dùng để lưu mật khẩu sau khi đã mã hoá (không lưu mật khẩu gốc của người dùng)
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        avatarUrl: {
            type: String, // link CDN để hiển thị hình
        },
        avatarId: {
            type: String, // Cloudinary public_id để xoá hình
        },
        bio: {
            type: String,
            maxLength: 500, // giới hạn ký tự (tuỳ)
        },
        phone: {
            type: String,
            sparse: true, // cho phép null, nhưng không được trùng
        },
    },
    {
        timestamps: true, // -> mongoDB sẽ tự thêm createdAt và updatedAt
    },
);

// Tạo model User
const User = mongoose.model("User", userSchema);
export default User;
