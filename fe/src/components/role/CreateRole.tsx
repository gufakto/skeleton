"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RoleForm } from "@/models/role"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SaveIcon, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { createRole } from "@/app/admin/role/actions";

export const CreateRole = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof RoleForm>>({
        resolver: zodResolver(RoleForm),
        defaultValues: {
            name: '',
            type: '',
            description: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof RoleForm>) => {
        startTransition(async () => {
            try {
                const res = await createRole(values)
                if (res.ok) {
                    toast.success('Role created successfully')
                    router.push('/admin/role')
                }
            } catch (err: any) {
                console.log(err)
                toast.error(err.message)
            }
        })
    }
    return (<>
    <LoadingFullpage isShown={isPending} />
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
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                            <Input placeholder="Type" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
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
    </>)
}