import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { OrderSearchableFields } from "./order.constant";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";
import { orderUtils } from "./order.utils";

const createOrderInDB = async (user: JwtPayload, payload: { products: { product: string; quantity: number }[] }, client_ip: string) => {
  const dbUser = await User.findOne({ email: user.email });

  if (!payload?.products?.length) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Order must contain at least one product.");
  }

  let totalPrice = 0;
  // get all product IDs
  const productIds = payload.products.map((p) => p.product);
  //get each product
  const dbProducts = await Product.find({ _id: { $in: productIds } });
  // Map products key value
  const productMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

  // Check stock availability
  for (const { product, quantity } of payload.products) {
    const dbProduct = productMap.get(product);
    if (!dbProduct) {
      throw new AppError(StatusCodes.NOT_FOUND, `Product with ID ${product} not found!`);
    }
    if (dbProduct.quantity < quantity) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.quantity}`);
    }
  }

  // order placement
  const orderedProducts = payload.products.map(({ product, quantity }) => {
    const dbProduct = productMap.get(product)!;
    dbProduct.quantity -= quantity;
    dbProduct.inStock = dbProduct.quantity > 0;
    totalPrice += dbProduct.price * quantity;
    return { product, quantity };
  });

  // Save product stock updates
  await Promise.all(dbProducts.map((p) => p.save()));

  let order = await Order.create({
    user: dbUser?._id,
    products: orderedProducts,
    totalPrice,
  });
  // console.log("user from order service", dbUser);
  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: dbUser?.name,
    customer_address: dbUser?.address,
    customer_email: dbUser?.email,
    customer_phone: dbUser?.phone,
    customer_city: "N/A",
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getAllOrderFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find().populate("user", "name email").populate("products.product"), query)
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  }
  return result;
};

const getAllMyOrderFromDB = async (email: string, role: string) => {
  if (role === "user") {
    const result = await Order.find().populate<{ user: { email: string } }>("user").populate("products.product").sort({ createdAt: -1 });

    const filteredOrders = result.filter((order) => {
      if (order.user && typeof order.user === "object" && "email" in order.user) {
        return order.user.email === email;
      }
      return false;
    });

    return filteredOrders;
  }
};

const updateOrderInDB = async (id: string, payload: Partial<TOrder>) => {
  const result = await Order.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  }
  return result;
};

const deleteOrderInDB = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  }
  return result;
};

const verifyPaymentInDB = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
              ? "Pending"
              : verifiedPayment[0].bank_status == "Cancel"
                ? "Cancelled"
                : "",
      },
    );
  }

  return verifiedPayment;
};

export const OrderServices = {
  createOrderInDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
  getAllMyOrderFromDB,
  updateOrderInDB,
  deleteOrderInDB,
  verifyPaymentInDB,
};
