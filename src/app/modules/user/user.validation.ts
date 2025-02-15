import { z } from "zod";
import { UserStatus } from "./user.constant";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().max(26),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  registerUserValidationSchema,
  loginUserValidationSchema,
  changePasswordValidationSchema,
  changeStatusValidationSchema,
};
