import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { OrderControllers } from "./order.controller";
import { orderValidations } from "./order.validation";

const router = express.Router();

router.post("/create-order", auth(USER_ROLE.user), OrderControllers.createOrder);

router.get("/my-order", auth(USER_ROLE.user), OrderControllers.getMyOrder);

router.get("/verify-payment", auth(USER_ROLE.user), OrderControllers.verifyPayment);

router.get("/", auth(USER_ROLE.admin), OrderControllers.getAllOrders);

router.get("/:id", auth(USER_ROLE.admin), OrderControllers.getSingleOrder);

router.patch("/:id", validateRequest(orderValidations.updateOrderValidationSchema), OrderControllers.updateOrder);

router.delete("/:id", OrderControllers.deleteOrder);

export const OrderRoutes = router;
