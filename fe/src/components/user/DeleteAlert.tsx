import { deleteUser } from "@/app/admin/user/actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Trash2 } from "lucide-react"
import React, { useTransition } from "react"
import { toast } from "react-toastify"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

type Props = {
    id: number
}

export const DeleteUserAlert: React.FC<Props> = ({ id }) => {
    const [isPending, startTransition] = useTransition()

    const deleteUserSubmit = () => {
        startTransition(async () => {
            try {
                // TODO: delete user
                const res = await deleteUser(id)
                if (res.ok) {
                    toast.success('User deleted successfully');
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                } else {
                    toast.error('Failed to delete user')
                }
            } catch (err: any) {
                toast.error(err.message)
            }
        })
    }

    return (
        <AlertDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button variant={'link'} >
                                <Trash2 />
                            </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Remove user </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="z-999999">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <AlertCircle className="text-red-500" />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-500">
                        Are you absolutely sure to remove #{id}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={deleteUserSubmit}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
