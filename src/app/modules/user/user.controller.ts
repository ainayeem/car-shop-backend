import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.registerUserInDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Registration successfull!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.ACCEPTED,
    success: true,
    message: "Login successfull!",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
};
