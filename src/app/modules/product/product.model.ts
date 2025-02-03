import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      validate: {
        validator: (value: number) => /^\d{4}$/.test(value.toString()),
        message: "Year must be four-digit number",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Sedan", "SUV", "Truck", "Coupe", "Convertible"],
        message: "Category must be one of Sedan, SUV, Truck, Coupe, Convertible",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be greater than or equal to 0"],
    },
    inStock: {
      type: Boolean,
      required: [true, "InStock status is required"],
    },
    imgUrl: {
      type: String,
      required: [true, "Image url is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>("Product", productSchema);
