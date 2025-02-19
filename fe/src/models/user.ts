import * as z from "zod";

export interface UserModel {
  id: number;
  name: string;
  email: string;
  blocked: boolean;
  created_at: string;
  updated_at: string;
};

export const CreateUserForm = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters",
  })
});