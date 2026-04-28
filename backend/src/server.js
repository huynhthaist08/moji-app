import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);

// Kết nối mongoDB với Server
connectDB().then(() => {
    // sau khi connectDB chạy xong mới chạy logic bên trong
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost${PORT}`);
    });
});
