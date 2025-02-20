"use client";
import React, { useEffect, useTransition } from "react";
import { UserModel } from "@/models/user";
import { Table, TableBody, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus, Info, Pencil } from "lucide-react";
import { getUsers } from "@/lib/user";
import { toast } from "react-toastify";
import LoadingFullpage from "../ui/loading/LoadingFullPage";
import { DynamicTable } from "../tables/DynamicTable";
import { DeleteUserAlert } from "../user/DeleteAlert";


export default function TableRole() {
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
      }
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
          columns={[
            {label: 'Name', name: 'name'}, 
            {label: 'Email', name: 'email'}, 
            {label: 'Role', name: 'role'}, 
            {label: 'Action', name: 'action', render: (item) => {
              return <>
              <Link href={'/admin/user/' + item.id}>
                    <Button variant={'link'}>
                      <Pencil />
                    </Button>
                  </Link>
                  <DeleteUserAlert id={item.id} />
                  <Link href={'/admin/user/' + item.id + '/detail'}>
                    <Button variant={'link'} >
                      <Info />
                    </Button>
                  </Link></>;
            }}]} 
          data={users} footer={false} />
        <Pagination className="flex mt-4">
          <PaginationContent className="ml-auto">
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
