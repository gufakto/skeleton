import * as z from "zod";

export const FormLogin = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters",
  }),
});

export enum BlockedStatus {
  Active = "false",
  Inactive = "true",
}

export const EditUserForm = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  blocked: z.enum([BlockedStatus.Active, BlockedStatus.Inactive], {
    message: "Please select an option",
  }),
});