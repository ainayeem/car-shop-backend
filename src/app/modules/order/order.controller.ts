import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.createOrderInDB(user, req.body, req.ip!);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Order placed succesfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrderFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id: orderId } = req.params;
  const result = await OrderServices.getSingleOrderFromDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order retrieved succesfully",
    data: result,
  });
});

const getMyOrder = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await OrderServices.getAllMyOrderFromDB(email, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My order retrieved succesfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  // console.log("in verify payment");
  // console.log("requ", req.query);

  const result = await OrderServices.verifyPaymentInDB(req.query.order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment verified succesfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { id: orderId } = req.params;
  const result = await OrderServices.updateOrderInDB(orderId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order updated succesfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id: orderId } = req.params;
  const result = await OrderServices.deleteOrderInDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order deleted succesfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getMyOrder,
  updateOrder,
  deleteOrder,
  verifyPayment,
};
