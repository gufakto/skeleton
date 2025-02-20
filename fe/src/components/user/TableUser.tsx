"use client";
import React, { useEffect, useTransition } from "react";
import { UserModel } from "@/models/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus, Info, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { DynamicTable } from "../tables/DynamicTable";
import { DeleteUserAlert } from "./DeleteAlert";
import { getRelativeTime } from "@/lib/utils";
import { getUsers } from "@/app/admin/user/actions";


export default function TableUser() {
  const [users, setUsers] = React.useState<UserModel[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getUsers();
        if (res.ok) {
          setUsers(res.data);
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
              name: "action", label: "Action", render: (row) => (<>
                <Link href={'/admin/user/' + row.id}>
                  <Button variant={'link'}>
                    <Pencil />
                  </Button>
                </Link>
                <DeleteUserAlert id={row.id} />
                <Link href={'/admin/user/' + row.id + '/detail'}>
                  <Button variant={'link'} >
                    <Info />
                  </Button>
                </Link>
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
