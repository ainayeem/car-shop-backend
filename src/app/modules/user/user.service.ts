import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../errors/AppError";
import { UserSearchableFields } from "./user.constant";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import { createToken } from "./user.utils";

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query).search(UserSearchableFields).filter().sort().paginate().fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const registerUserInDB = async (payload: TUser) => {
  const newUser = await User.create(payload);

  return newUser;
};

const loginUserInDB = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === "block") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password not matched");
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  return accessToken;
};

const changePasswordInDB = async (userData: JwtPayload, payload: { oldPassword: string; newPassword: string }) => {
  const user = await User.isUserExistsByEmail(userData.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === "block") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

  await User.findOneAndUpdate(
    { email: userData.email, role: userData.role },
    {
      password: newHashedPassword,
    },
  );

  return null;
};

const changeStatusInDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  getAllUserFromDB,
  registerUserInDB,
  loginUserInDB,
  changePasswordInDB,
  changeStatusInDB,
};
// 🚀 ~ loginUserInDB ~ user: {
//   _id: new ObjectId('6798bcc1e6af2188154be2c8'),
//   name: 'Jane Smith',
//   email: 'janesmith@example.com',
//   password: '$2b$12$QnXrWj5OSncvgXBYBjeB9.UkZG6yDTYjKzrFS5r7cowYk/Wt3fug2',
//   phone: '987-654-3210',
//   address: '456 Elm Street, Shelbyville',
//   role: 'user',
//   createdAt: 2025-01-28T11:17:21.063Z,
//   updatedAt: 2025-01-28T11:17:21.063Z,
//   __v: 0
// }
