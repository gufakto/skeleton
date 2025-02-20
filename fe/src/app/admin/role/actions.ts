"use server";
import { authOptions } from "@/lib/auth";
import { RoleForm } from "@/models/role";
import axios from "axios";
import { getServerSession } from "next-auth";
import * as z from "zod";


const API_URL = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/admin/role`;

export const getRoles = async () => {
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
        return {
            ok: response.status === 200,
            data: response.data
        };
    } catch (error: any) {
        console.error("Error fetching roles:", error);
        return { ok: false, error: error?.response.data || "Internal Server Error" }
    }
}

export const createRole = async(values: z.infer<typeof RoleForm>) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const { name, type, description } = values;
        const response = await axios.post(API_URL, {
            name,
            type,
            description,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 201) {
            return { ok: false, error: "Failed to create role" }
        }
        return {
            ok: true,
            data: response.data
        };
    } catch (error: any) {
        console.error("Error creating role:", error);
        return { ok: false, error: error?.response.data || "Invalid request body" }
    }
}

export const getRole = async (id: string) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });
        return {
            ok: response.status === 200,
            data: response.data
        };
    } catch (error: any) {
        console.error("Error fetching role:", error);
        return { ok: false, error: error?.response.data || "Internal Server Error" }
    }
}

export const updateRole = async (id: number, values: z.infer<typeof RoleForm>) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const { name, type, description } = values;
        const response = await axios.put(`${API_URL}/${id}`, {
            name,
            type,
            description,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        }
        );
        if (response.status != 200) {
            return { ok: false, error: "Failed to update role" }
        }
        return {
            ok: true,
            data: response.data
        }
    } catch(err: any) {
        console.error("Error fetching role:", err);
        return { ok: false, error: err?.response.data || "Internal Server Error" }
    }
}

export const deleteRole = async (id: number) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });
        return {
            ok: response.status === 200,
            data: response.data
        };
    } catch (error: any) {
        console.error("Error deleting role:", error);
        return { ok: false, error: error?.response.data || "Internal Server Error" }
    }
}