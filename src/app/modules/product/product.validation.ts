import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z
      .number()
      .gte(1000, { message: "Year must be a valid four-digit number" })
      .lte(9999, { message: "Year must be a valid four-digit number" }),
    price: z.number().min(0, { message: "Price must be greater than or equal to 0" }),
    category: z.enum(["Sedan", "SUV", "Truck", "Coupe", "Convertible"], {
      errorMap: () => ({
        message: "Category must be one of Sedan, SUV, Truck, Coupe, Convertible",
      }),
    }),
    description: z.string(),
    quantity: z.number().min(0, { message: "Quantity must be greater than or equal to 0" }),
    inStock: z.boolean(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z
      .number()
      .gte(1000, { message: "Year must be a valid four-digit number" })
      .lte(9999, { message: "Year must be a valid four-digit number" })
      .optional(),
    price: z.number().min(0, { message: "Price must be greater than or equal to 0" }).optional(),
    category: z
      .enum(["Sedan", "SUV", "Truck", "Coupe", "Convertible"], {
        errorMap: () => ({
          message: "Category must be one of Sedan, SUV, Truck, Coupe, Convertible",
        }),
      })
      .optional(),
    description: z.string().optional(),
    quantity: z.number().min(0, { message: "Quantity must be greater than or equal to 0" }).optional(),
    inStock: z.boolean().optional(),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
