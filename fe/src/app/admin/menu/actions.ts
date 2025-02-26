"use server";
import { authOptions } from "@/lib/auth";
import { MenuSchema } from "@/models/menu";
import axios from "axios";
import { getServerSession } from "next-auth";
import * as z from "zod";

const API_URL = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/admin/menu`;

export const getMenus = async () => {
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
        console.error("Error fetching menu:", error);
        return { ok: false, error: error?.response.data || "Internal Server Error" }
    }
}

export const createMenu = async (values: z.infer<typeof MenuSchema>) => {
    const session = await getServerSession(authOptions)
    if(!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const res = await axios.post(`${API_URL}`, values, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        return { ok: true, data: res.data}
    } catch(err: any) {
        console.log("Error fetching create menu", err);
        return { ok: false, error: err?.response.data || "Internal server error"}
    }
}

export const getMenu = async (id: string) => {
    const session = await getServerSession(authOptions)
    if(!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const res = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        return { ok: true, data: res.data}
    } catch(err: any) {
        console.log("Error fetching menu", err);
        return { ok: false, error: err?.response.data || "Internal server error"}
    }
}

export const updateMenu = async (id: number, values: z.infer<typeof MenuSchema>) => {
    const session = await getServerSession(authOptions)
    if(!session) {
        return { ok: false, error: "Unauthorized" }
    }
    try {
        const res = await axios.put(`${API_URL}/${id}`, values, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        return { ok: true, data: res.data}
    } catch(err: any) {
        console.log("Error fetching update menu", err);
        return { ok: false, error: err?.response.data || "Internal server error"}
    }
}