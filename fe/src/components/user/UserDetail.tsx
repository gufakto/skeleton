"use client";
import { UserModel } from "@/models/user";
import Link from "next/link";
import { BlockedStatus, EditUserForm } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { SaveIcon, Undo2 } from "lucide-react";
import { updateUser } from "@/app/admin/user/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type UserDetailProps = {
    user: UserModel;
    editable?: boolean;
};

const UserDetail: React.FC<UserDetailProps> = ({
    user,
    editable = false,
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const form = useForm<z.infer<typeof EditUserForm>>({
        resolver: zodResolver(EditUserForm),
        defaultValues: {
            name: user.name,
            email: user.email,
            blocked: user.blocked ? BlockedStatus.Inactive : BlockedStatus.Active,
        }
    })

    const handleRadioChange = (value: BlockedStatus) => {
        if (value === BlockedStatus.Active) {
            form.setValue("blocked", BlockedStatus.Active, { shouldValidate: true, shouldDirty: true });
        } else {
            form.setValue("blocked", BlockedStatus.Inactive, { shouldValidate: true, shouldDirty: true });
        }
    }

    const handleSubmit = (values: z.infer<typeof EditUserForm>) => {
        startTransition(async () => {
            try {
                const res = await updateUser(user.id, values);
                if (res.ok) {
                    toast.success("User updated successfully");
                    router.push("/admin/user");
                } else {
                    toast.error("Failed to update user");
                }
            } catch (err: any) {
                toast.error(err.message);
            }
        });
    }

    return (<>
        <Form {...form}>
            <LoadingFullpage isShown={isPending} />
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}
                />
                <FormField
                    control={form.control}
                    name="blocked"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blocked</FormLabel>
                            <FormControl>
                                <RadioGroup {...field} onValueChange={(value) => form.setValue("blocked", value=="true"?BlockedStatus.Inactive:BlockedStatus.Active, { shouldValidate: true, shouldDirty: true })}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="blocked-one" />
                                        <Label htmlFor="blocked-one">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="blocked-two" />
                                        <Label htmlFor="blocked-two">Inactive</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}
                />
                <div className="flex flex-col gap-4 md:flex-row my-2">
                    <div className="w-full flex items-center justify-between">
                        <Button type="button" variant={'secondary'} onClick={() => router.back()}>
                            <Undo2 /> Back
                        </Button>
                        {editable &&
                        <Button type="submit">
                            <SaveIcon /> Save
                        </Button>}
                    </div>
                </div>
            </form>
        </Form>
    </>)
}

export default UserDetail;