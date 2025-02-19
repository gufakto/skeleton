import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/admin/user`;

// ✅ GET: Get Users
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: error?.response.data || "Internal Server Error" }, { status: 500 });
    }
}

// ✅ PUT: Update User
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json(); // Get request body
        const { id, ...updateData } = body; // Extract user ID and update data

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const response = await axios.put(`${API_URL}/${id}`, {
            email: updateData.email,
            name: updateData.name,
            blocked: updateData.blocked,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 200) {
            return NextResponse.json({ error: "Failed to update user" }, { status: response.status });
        }

        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return NextResponse.json({ error: error?.response.data || "Invalid request body" }, { status: 400 });
    }
}

// ✅ DELETE: Delete User
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            }
        });
        if (response.status != 200) {
            return NextResponse.json({ error: "Failed to delete user" }, { status: response.status });
        }
        console.log("RESP GOLANG", response.data, response.status);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return NextResponse.json({ error: error?.response.data || "Invalid request body" }, { status: 400 });
    }
}

// ✅ POST: Create User
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { email, name, password } = body;
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
            return NextResponse.json({ error: "Failed to create user" }, { status: response.status });
        }
        return NextResponse.json(response.data, { status: response.status });
    } catch(error: any) {
        console.log("ERR GOLANG", error?.response.data);
        return NextResponse.json({ error: error?.response.data || "Invalid request body" }, { status: 400 });
    }
}