import * as z from "zod"

export interface RoleModel {
    id: number;
    name: string;
    type: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const RoleForm = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  type: z.string().min(2,{
    message: "Type is required",
  }),
  description: z.string()
});