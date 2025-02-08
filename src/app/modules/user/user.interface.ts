import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: "admin" | "user";
  status: "active" | "block";
  //   passwordChangedAt?: Date;
}

export type TLoginUser = {
  email: string;
  password: string;
};

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;

  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
