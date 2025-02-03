import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post("/register", validateRequest(userValidations.registerUserValidationSchema), UserControllers.registerUser);

router.post("/login", validateRequest(userValidations.loginUserValidationSchema), UserControllers.loginUser);

export const UserRoutes = router;
