import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import myHotelRouter from "./routes/my-hotels";
import hotelRouter from "./routes/hotels";
import bookingsRouter from "./routes/my-bookings";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/my-hotels", myHotelRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/my-bookings", bookingsRouter);

const connectDB = async () => {
  try {
    const connectionString = process.env.MONOGDB_URI + "/booking";
    console.log(connectionString);
    await mongoose.connect(connectionString).then(() => {
      console.log("Connected to database !!");
      console.log(connectionString);
    });
  } catch (error) {
    console.error("Failed to connect DB !!");
  }
};
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port: ${port} !!`);
});
