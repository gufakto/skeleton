import * as z from "zod";

export interface MenuModel {
    id: number;
    name: string;
    description: string;
    parent_id: number;
    icon: string;
    childs: MenuModel[];
    created_at: string;
    updated_at: string;
}

export const MenuSchema = z.object({
    name: z.string().min(3).max(255),
    description: z.string().optional(),
    parent_id: z.number().optional(),
    icon: z.string().optional(),
});

export interface MenuOptions{
    value: string;
    label: string;
} 

export interface TreeNode {
    id: string;
    name: string;
    icon: string;
    children?: TreeNode[];
  }