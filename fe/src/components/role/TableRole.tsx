"use client";
import React, { useEffect, useTransition } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus, Info, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { DynamicTable } from "@/components/tables/DynamicTable";
import { DeleteUserAlert } from "@/components/user/DeleteAlert";
import { RoleModel } from "@/models/role";
import { getRoles } from "@/app/admin/role/actions";
import { DeleteRoleAlert } from "./DeleteRoleAlert";
import { useRouter } from "next/navigation";


export default function TableRole() {
  const [roles, setRoles] = React.useState<RoleModel[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getRoles();
        if (res.ok) {
          setRoles(res.data.data);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  }, [])

  return (
    <div >
      <LoadingFullpage isShown={isPending} />
      <div className="flex">
        <Link href={'/admin/role/create'} className="ml-auto">
          <Button><FilePlus /> Add </Button>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto mt-2">
        <DynamicTable
          columns={[
            { label: 'Name', name: 'name' },
            { label: 'Type', name: 'type' },
            { label: 'Description', name: 'description' },
            {
              label: 'Action', name: 'action', render: (item: RoleModel) => {
                return <>
                  <Button variant={'link'} onClick={() => router.push(`/admin/role/${item.id}`)}>
                    <Pencil />
                  </Button>
                  <DeleteRoleAlert id={item.id} /></>;
              }
            }]}
          data={roles} footer={false} />
      </div>
    </div>
  );
}
