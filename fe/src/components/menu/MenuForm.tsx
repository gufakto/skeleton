"use client";

import { MenuModel, MenuOptions, MenuSchema } from "@/models/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import Select from "react-select";
import { Button } from "../ui/button";
import { SaveIcon, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMenu, getMenus, updateMenu } from "@/app/admin/menu/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "react-toastify";

type Props = {
    menu?: MenuModel
}

export const MenuForm: FC<Props> = ({ menu }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const [options, setOptions] = useState<MenuOptions[]>([]);
    useEffect(() => {
        startTransition(async () => {
            const res = await getMenus()
            if (res.ok) {
                const menus = res.data.data
                const options = menus?.map((item: MenuModel) => ({
                    value: item.id.toString(),
                    label: item.name
                }))
                setOptions(options)
            }
        })
    }, [])
    useEffect(() => {
        if(menu) {
            form.reset({
                name: menu?.name || "",
                description: menu?.description || "",
                parent_id: menu?.parent_id || 0,
                icon: menu?.icon || "",
            })
        }
    }, [menu])
    
    const form = useForm<z.infer<typeof MenuSchema>>({
        resolver: zodResolver(MenuSchema),
        defaultValues: {
            name: menu?.name || "",
            description: menu?.description || "",
            parent_id: menu?.parent_id || 0,
            icon: menu?.icon || "",
        }
    })
    const onSubmit = (values: z.infer<typeof MenuSchema>) => {
        startTransition(async () => {
            try {
                if(!menu) {
                    console.log(values)
                    const res = await createMenu(values);
                    if(res.ok) {
                        toast.success("Success to save data menu");
                        router.push("/admin/menu")
                    } else {
                        toast.error("Failed to save data menu");
                    }
                } else {
                    console.log(values)
                    const res = await updateMenu(menu.id, values);
                    if(res.ok) {
                        toast.success("Success to save data menu");
                        router.push("/admin/menu")
                    } else {
                        toast.error("Failed to save data menu");
                    }
                }
            } catch(err: any) {
                toast.error(err.message || "something wrong when try to save data")
            }
        })
    }

    return (<>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of menu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}
                />
                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='pl-2'>Parent</FormLabel>
                            <Select 
                                value={field.value?.toString()??"0"} 
                                onValueChange={(val) => field.onChange(parseInt(val))}
                            >
                                <FormControl>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select menu parent" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {options?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                                <Input placeholder="Icon of menu" {...field} />
                            </FormControl>
                                <FormDescription className="text-xs text-orange-400">
                                    <a href="https://lucide.dev/icons/" target="_blank">Icons</a>
                                </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description of menu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row gap-2 justify-between">
                    <Button type="button" variant={'secondary'} onClick={() => router.back()}>
                        <Undo2 /> Back
                    </Button>
                    <Button type="submit">
                        <SaveIcon /> Save
                    </Button>
                </div>
            </form>
        </Form>
    </>)
}