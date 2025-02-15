import { z } from "zod";

const updateOrderValidationSchema = z.object({
  body: z.object({
    status: z
      .enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"], {
        errorMap: () => ({
          message: "Status must be one of Pending, Paid, Shipped, Completed, Cancelled",
        }),
      })
      .optional(),
    eta: z.string().optional(),
  }),
});

export const orderValidations = {
  updateOrderValidationSchema,
};
