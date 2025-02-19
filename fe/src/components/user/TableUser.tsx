"use client";
import React, { useEffect, useTransition } from "react";
import { UserModel } from "@/models/user";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus, FilePlus, Info, Pencil, Trash } from "lucide-react";
import { getUsers } from "@/lib/user";
import { toast } from "react-toastify";
import LoadingFullpage from "../ui/loading/LoadingFullPage";
import { DeleteUserAlert } from "./DeleteAlert";


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
        <Table className="min-w-full table-auto">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[175px]">
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
                  </Link>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell className="text-right">{item.blocked ? "Inactive" : "Active"}</TableCell>
                <TableCell>{getRelativeTime(item.created_at)}</TableCell>
                <TableCell>{getRelativeTime(item.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableFooter>
        </Table>
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
