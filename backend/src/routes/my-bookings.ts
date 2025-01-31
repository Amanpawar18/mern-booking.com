import express from "express";
import { verifyToken } from "../middleware/auth";
import { Request, Response } from "express";
import Hotel from "../models/hotles";
import { HotelType } from "../shared/types";

const bookingsRouter = express.Router();

bookingsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: {
        $elemMatch: { userId: req.userId },
      },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId == req.userId
      );
      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };
      return hotelWithUserBookings;
    });

    return res.status(201).json(results);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({ message: "Something went wrong !!" });
  }
});

export default bookingsRouter;
