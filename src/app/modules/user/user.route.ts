import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/", UserControllers.getAllUser);

router.post("/register", validateRequest(userValidations.registerUserValidationSchema), UserControllers.registerUser);

router.post("/login", validateRequest(userValidations.loginUserValidationSchema), UserControllers.loginUser);

router.post(
  "/change-password",
  auth(USER_ROLE.user),
  validateRequest(userValidations.changePasswordValidationSchema),
  UserControllers.changePassword,
);

router.patch(
  "/change-status/:id",
  auth(USER_ROLE.admin),
  validateRequest(userValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
