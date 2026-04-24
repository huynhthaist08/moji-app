import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Liên kết với CSDL thành công!");
    } catch (error) {
        console.error("Lỗi khi kết nối CSDL:", error);
        process.exit(1); // Dừng khi lỗi
    }
};
