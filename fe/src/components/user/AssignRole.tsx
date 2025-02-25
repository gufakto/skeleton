import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserCheck2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AssignRoleForm, UserModel } from "@/models/user"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RoleOptions } from "@/models/role"
import Select from "react-select";
import { assignToleToUser } from "@/app/admin/user/actions"
import { toast } from "react-toastify"

type Props = {
    user: UserModel
    roles: RoleOptions[]
}

export const AssignRoleDialog = ({ user, roles }: Props) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof AssignRoleForm>>({
        resolver: zodResolver(AssignRoleForm),
        defaultValues: {
            roles: [],
            user: user.id
        }
    })

    const submitRole = (values: z.infer<typeof AssignRoleForm>) => {
        startTransition(async () => {
            try {
                const res = await assignToleToUser(values);
                if (res.ok) {
                    form.reset();
                    toast.success("Role assigned successfully");
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                } else {
                    console.log(res.error)
                    toast.error(res.error?.message || "Failed to assign role");
                }
            } catch(err: any) {
                toast.error(err.message);
            }
        })
    }

    return (
        <Dialog>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="link">
                                <UserCheck2 />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Assign Role to user #{user.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[425px] z-999999">

                <DialogHeader>
                    <DialogTitle>Assign Role #{user.name}</DialogTitle>
                    <DialogDescription>
                        Please assign role to the users here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitRole)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Roles</FormLabel>
                                    <FormControl>
                                        <Select
                                            isMulti
                                            options={roles} // Ensure roles = [{ value: "admin", label: "Admin" }]
                                            value={roles.filter(role => field.value?.includes(Number(role.value)))} // Ensure proper selected state
                                            onChange={(selected) => {
                                                field.onChange(selected.map(option => option.value)); // Store only values
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
