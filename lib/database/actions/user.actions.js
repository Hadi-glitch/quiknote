"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "..";
import User from "../models/user.model";

export async function createUser(user) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserId(email) {
  try {
    await connectToDatabase();

    // Fetch the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    return user._id.toString(); // Return the _id as a string
  } catch (error) {
    console.error("Error fetching userId:", error);
    handleError(error);
    return null; // Return null if there's an error
  }
}

export async function getUser(userId) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}