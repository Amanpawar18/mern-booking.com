import express, { Request, response, Response } from "express";
import Hotel from "../models/hotles";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import { verifyToken } from "../middleware/auth";

const hotelRouter = express.Router();


hotelRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().select("-bookings");
    res.status(201).json(hotels);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ message: "Something went wrong !!" });
  }
});


hotelRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        currentPage: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    return res.status(201).json(response);
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({ message: "Something went wrong !!" });
  }
});

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

hotelRouter.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel id is required.")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      if (!hotel) res.status(404).json({ message: "Hotel not found !!" });

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong !!" });
    }
  }
);

hotelRouter.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // check payment completed

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findByIdAndUpdate(
        {
          _id: req.params.hotelId,
        },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel)
        return res.status(404).json({ message: "hotel not found !!" });

      return res
        .status(201)
        .json({ message: "booking completed successfully !!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong !!" });
    }
  }
);

export default hotelRouter;
