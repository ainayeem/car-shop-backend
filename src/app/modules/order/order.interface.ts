import { Types } from "mongoose";

export type TOrder = {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  eta?: Date;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};

export type TUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TProduct = {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
  imgUrl: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
