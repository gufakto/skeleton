"use client";
import React, { useEffect, useState, useTransition } from "react";
import { UserModel } from "@/models/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { DynamicTable } from "../tables/DynamicTable";
import { DeleteUserAlert } from "./DeleteAlert";
import { getRelativeTime } from "@/lib/utils";
import { getUsers } from "@/app/admin/user/actions";
import { AssignRoleDialog } from "./AssignRole";
import { RoleModel, RoleOptions } from "@/models/role";
import { getRoles } from "@/app/admin/role/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


export default function TableUser() {
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [isPending, startTransition] = useTransition();
  const [roles, setRoles] = useState<RoleOptions[]>([])

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getUsers();
        if (res.ok) {
          setUsers(res.data);
        }

        const roles = await getRoles()
        if (roles.ok) {
          setRoles(roles?.data?.data?.map((item: RoleModel) => ({ value: item.id, label: item.name })))
        }

      } catch (err: any) {
        toast.error(err.message);
      };
    });
  }, [])

  return (
    <div >
      <LoadingFullpage isShown={isPending} />
      <div className="flex">
        <Link href={'/admin/user/create'} className="ml-auto">
          <Button><FilePlus /> Add </Button>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto mt-2">
        <DynamicTable
          data={users}
          footer={true}
          columns={[
            {
              name: "action", label: "Action", render: (row: UserModel) => (<>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={'/admin/user/' + row.id}>
                          <Button variant={'link'}>
                            <Pencil />
                          </Button>
                        </Link>
                      
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Update user </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DeleteUserAlert id={row.id} />
                <AssignRoleDialog user={row} roles={roles} />
              </>)
            },
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "blocked", label: "Status", render: (row) => row.blocked ? "Blocked" : "Active" },
            { name: "createdAt", label: "Created At", render: (row) => getRelativeTime(row.created_at) },
            { name: "updatedAt", label: "Updated At", render: (row) => getRelativeTime(row.updated_at) },
          ]}
        />
      </div>
    </div>
  );
}
