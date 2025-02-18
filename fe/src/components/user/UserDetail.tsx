"use client";
import { UserModel } from "@/models/user";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import Radio from "../form/input/Radio";
import { BlockedStatus, EditUserForm } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type UserDetailProps = {
  user: UserModel;
  editable?: boolean;
};

const UserDetail: React.FC<UserDetailProps> = ({
    user,
    editable = false,
}) => {
    
    const form = useForm<z.infer<typeof EditUserForm>>({
        resolver: zodResolver(EditUserForm),
        defaultValues: {
            name: user.name,
            email: user.email,
            blocked: user.blocked?BlockedStatus.Inactive:BlockedStatus.Active,
        }
    })

    const handleRadioChange = (value: BlockedStatus) => {
        console.log(value);
        if (value === BlockedStatus.Active) {
            form.setValue("blocked", BlockedStatus.Active, { shouldValidate: true, shouldDirty: true });
        } else {
            form.setValue("blocked", BlockedStatus.Inactive, { shouldValidate: true, shouldDirty: true });
        }
    }
    
    const handleSubmit = (values: z.infer<typeof EditUserForm>) => {
        console.log(values);
    }

    return (<>
    <div className="flex flex-col gap-4">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input
                    type="text"
                    className={`block w-full rounded-lg border border-gray-300 ${editable?'bg-white-50':'bg-gray-50'} p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                    placeholder="name"
                    readOnly={!editable}
                    {...form.register('name')}
                />
            </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                type="text"
                className={`block w-full rounded-lg border border-gray-300 ${editable?'bg-white-50':'bg-gray-50'} p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                placeholder="email"
                readOnly={!editable}
                {...form.register('email')}
                />
            </div>
        </div>
        <div className="">
            <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Status</label>
            </div>
            <div className="w-full">
                {!editable? <span>{(user.blocked?"Inactive": "Active")}</span>:
                <div className="w-full flex items-center justify-start gap-4">
                    <input type="radio"
                        id="blocked"
                        value={BlockedStatus.Inactive}
                        checked={form.watch("blocked")===BlockedStatus.Inactive}
                        {...form.register('blocked')}
                        onChange={() => handleRadioChange(BlockedStatus.Inactive)}
                    /> <span>Inactive</span>
                    <input type="radio"
                        id="blocked"
                        value={BlockedStatus.Active}
                        checked={form.watch("blocked")===BlockedStatus.Active}
                        {...form.register('blocked')}
                        onChange={() => handleRadioChange(BlockedStatus.Active)}
                    /> <span>Active</span>
                    {form.formState.errors.blocked && <p>{form.formState.errors.blocked.message}</p>}
                </div>}
            </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row my-2">
            <div className="w-full flex items-center justify-between">
                <Link 
                    href={`/admin/user`} 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"> Back</Link>
                {editable && 
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                </button>}
            </div>
        </div>
        </form>
    </div>
    </>)
}

export default UserDetail;