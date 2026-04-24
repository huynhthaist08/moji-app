import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());

connectDB().then(() => {
    // sau khi connectDB chạy xong mới chạy logic bên trong
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost${PORT}`);
    });
});
