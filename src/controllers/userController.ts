import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

// Define custom Request types for user data
interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

// Update user profile
const updateProfile = asyncHandler(async (req: UserRequest, res: Response) => {
  const userId = req.user?.id; // Get userId from the authenticated user's token
  const { username, lastName, firstName, phoneNumber, user_type } = req.body;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error("Username already registered");
    }
    user.username = username;
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;


  const updatedUser = await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
  
    },
  });
});

// Login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields required");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
            username: user.username,
            email: user.email,
            id: user.id,
            firstName: user.firstName, // firstName included in token
            lastName: user.lastName, // lastName included in token
          },
      },
      process.env.ACCESS_TOKEN_SECRET || "default_secret", 
      { expiresIn: "500000000m" }
    );

    res.status(200).json({
      status: "success",
      message: "User data retrieved",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName, // Returning firstName
        lastName: user.lastName,   // Returning lastName
      },    
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// Register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, lastName, firstName, password, confirmPassword, username } = req.body;

  if (!email || !password || !firstName || !lastName || !username) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already registered");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    lastName,
    firstName,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
});

export { registerUser, loginUser, updateProfile };
