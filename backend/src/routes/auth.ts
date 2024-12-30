import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verify } from "crypto";
import { verifyToken } from "../middleware/auth";

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more chars are required").isLength({
      min: 3,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials !!" });

      const isMatch = await bcrypt.compare(password.toString(), user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials !!" });

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

      return res
        .status(200)
        .json({ userId: user._id, message: "Logged in successfully !!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong !!" });
    }
  }
);

authRouter.get(
  "/validate-token",
  verifyToken,
  (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
  }
);

authRouter.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send(200).json({ message: 'Sign out successfully !!' });
});

export default authRouter;
