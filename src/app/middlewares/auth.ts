/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: TUserRole[]) => {
  // console.log("🚀 ~ auth ~ requiredRoles:", requiredRoles);
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    // console.log("🚀 ~ returncatchAsync ~ decoded:", decoded);
    const { role, email } = decoded;
    // console.log("🚀 ~ returncatchAsync ~ role:", role);

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === "blocked") {
      throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked !!");
    }

    // if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
    //   throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized !");
    // }

    // console.log("🚀 ~ returncatchAsync ~ requiredRoles:", requiredRoles);
    // console.log("🚀 ~ returncatchAsync ~ Roles:", role);
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized dd!");
    }

    req.user = decoded as JwtPayload;
    next();

    //
  });
};

export default auth;
