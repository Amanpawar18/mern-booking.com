import express, { Request, Response, Router } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { verifyToken } from "../middleware/auth";

const userRouter = express.Router();

//api/users/register
userRouter.post(
  "/register",
  [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user)
        return res.status(400).send({ message: "User already exists !!" });

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      if (user) return res.status(200).json({ message: "User registered OK." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong !!" });
    }
  }
);

userRouter.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.json(user);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Something went wrong !!" });
  }
});

export default userRouter;
