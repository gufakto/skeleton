"use server";
import * as z from "zod";
import { authOptions } from "@/lib/auth";
import { CreateUserForm } from "@/models/user";
import axios from "axios";
import { getServerSession } from "next-auth";
import { EditUserForm } from "@/schemas";

const API_URL = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/admin/user`;

export const getUsers = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });
        return { ok: true, data: response.data };
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return { ok: false, error: error?.response.data || "Internal Server Error" }
    }
}

export const createUser = async (values: z.infer<typeof CreateUserForm>) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const { email, name, password } = values;
        const response = await axios.post(API_URL, {
            email: email,
            name: name,
            password: password,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 200) {
            return { ok: true, error: "Failed to create user" }
        }
        return { ok: true, data: response.data}
    } catch(error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return { ok: false, error: error?.response.data || "Invalid request body" }
    }
}

export const updateUser = async (id: number, values: z.infer<typeof EditUserForm>) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }

    try {
        if (!id) {
            return { ok: false, error: "User ID is required" }
        }

        const response = await axios.put(`${API_URL}/${id}`, {
            email: values.email,
            name: values.name,
            blocked: values.blocked,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 200) {
            return { ok: false, error: "Failed to update user" }
        }

        return { ok: true, data: response.data }
    } catch (error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return { ok: false, error: error?.response.data || "Invalid request body" }
    }
}

export const deleteUser = async (id: number) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }

    try {
        if (!id) {
            return { ok: false, error: "User ID is required" }
        }
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 200) {
            return { ok: false, error: "Failed to delete user" }
        }
        return { ok: true, data: response.data }
    } catch (error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return { ok: false, error: error?.response.data || "Invalid request body" }
    }
}