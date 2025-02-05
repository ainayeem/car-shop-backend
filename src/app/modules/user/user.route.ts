import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post("/register", validateRequest(userValidations.registerUserValidationSchema), UserControllers.registerUser);

router.post("/login", validateRequest(userValidations.loginUserValidationSchema), UserControllers.loginUser);

router.post(
  "/change-password",
  auth(USER_ROLE.user),
  validateRequest(userValidations.changePasswordValidationSchema),
  UserControllers.changePassword,
);

export const UserRoutes = router;
