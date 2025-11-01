import express from "express";
import cors from "cors";
// import * as passport from "passport";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from './Routes/auth.js';
import { errorMiddleware } from "./middlewares/ErrorMidlleware.js";
import morgan from "morgan";
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// app.use(passport.initialize());
// Routes
app.use("/auth", authRouter);
// Error Handling Middleware (should be after all routes)
app.use(errorMiddleware);
// Database connection & Server start
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 5000;
mongoose.connect(MONGO_URI, {})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error("Failed to connect to MongoDB", err);
});
//# sourceMappingURL=server.js.map