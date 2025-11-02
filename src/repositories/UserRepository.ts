import type { IUser } from "../models/User.js";
import User from "../models/User.js";

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<void> {
    try {
      const user = new User(userData);
      await user.save();
    } catch (e: any) {
      if (e && e.code === 11000 && e.keyPattern?.email) {
        throw new Error("Email already in use");
      }
      throw e;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );
  }
  async updateUser(id: string, userData: Partial<IUser>): Promise<void> {
    await User.findByIdAndUpdate(id, userData);
  }
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password")  ;
  }
}
