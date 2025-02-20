"use client";
import { RoleForm, RoleModel } from "@/models/role";
import React, { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SaveIcon, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateRole } from "@/app/admin/role/actions";
import LoadingFullpage from "../ui/loading/LoadingFullPage";

type Props = {
    data: RoleModel
}

export const EditRole: React.FC<Props> = ({ data }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof RoleForm>>({
        resolver: zodResolver(RoleForm),
        defaultValues: {
            name: data?.name,
            type: data?.type,
            description: data?.description,
        }
    })
    const onSubmit = async (values: z.infer<typeof RoleForm>) => {
        startTransition(async () =>{
            try {
                const res = await updateRole(data.id, values)
                if(res.ok) {
                    toast.success("Role updated successfully")
                    router.push("/admin/role")
                } else {
                    toast.error(res.error)
                }
            } catch(err: any) {
                toast.error(err.message)
            }
        });
    }
    
    return (
        <div>
            <LoadingFullpage isShown={isPending}/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="Type" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)}
                    />
                    <div className="flex flex-row gap-2 justify-between">
                <Button type="button" variant={'secondary'} onClick={() => router.back()}>
                    <Undo2/> Back
                </Button>
                <Button type="submit">
                    <SaveIcon/> Save
                </Button>
            </div>
                </form>
            </Form>
        </div>
    )
}