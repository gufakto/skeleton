"use client";
import { CreateUserForm } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createUser } from "@/lib/user";
import { useRouter } from "next/navigation";

const CreateUser = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const userForm = useForm<z.infer<typeof CreateUserForm>>({
        resolver: zodResolver(CreateUserForm),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const submitUser = (values: z.infer<typeof CreateUserForm>) => {
        startTransition(async () => {
            try {
                const res = await createUser(values);
                if (res.ok) {
                    toast.success("User created successfully");
                    router.push("/admin/user");
                } else {
                    toast.error("Failed to create user");
                }
            } catch(err: any) {
                toast.error(err?.response?.data?.message || "Something went wrong");
            }
        });
    }

    const showPassword = () => {
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }

    return (
        <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(submitUser)} className="space-y-8">
                <FormField
                    control={userForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john.doe@gmail" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={userForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input 
                                        id="password"
                                        {...field} 
                                        disabled={isPending}
                                        placeholder="******"
                                        type="password"
                                    />
                                    <Button type="button" variant={'default'} onClick={showPassword}>Show</Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )

}

export default CreateUser;