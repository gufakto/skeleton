import * as z from "zod";
import { EditUserForm } from "@/schemas";
import { CreateUserForm } from "@/models/user";

export const getUsers = async () => {
	try {
		const response = await fetch("/api/users");
		if (!response.ok) {
			throw new Error("Failed to fetch users");
		}
		const res = await response.json();
		return {
			ok: response.ok,
			data: res
		};
	} catch (error: any) {
		console.error("Error fetching users:", error);
		return {
			ok: false,
			data: []
		};
	}
};

export const updateUser = async (id: number, updateData: z.infer<typeof EditUserForm>) => {
	const response = await fetch("/api/users", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, ...updateData }),
	});
	if (!response.ok) {
		throw new Error("Failed to update user");
	}
	const res = await response.json();
	return {
		ok: response.ok,
		data: res.data
	};
};


export const createUser = async (userData: z.infer<typeof CreateUserForm>) => {
	try {
		const response = await fetch("/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
		if (!response.ok) {
			throw new Error("Failed to create user");
		}
		const res = await response.json();
		return {
			ok: response.ok,
			data: res.data,
			message: res.message
		};
	} catch(err: any) {
		console.error("Error creating user:", err);
		return {
			ok: false,
			data: null,
			message: err?.response.data || "Internal Server Error"
		};
	}
};

export const deleteUser = async (id: number) => {
	const response = await fetch(`/api/users`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
	if (!response.ok) {
		throw new Error("Failed to delete user");
	}
	const res = await response.json();
	return {
		ok: response.ok,
		data: res.data
	};
};