import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Separator } from "@/components/ui/separator";
import TableUser from "@/components/user/TableUser";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "CMS Panel User Page | Property Investment",
  description: "CMS Panel User Page | Property Investment",
};

export default function User() {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <PageBreadcrumb pageTitle="Users" />
      <Separator className="mb-2"/>
      <TableUser />
      </div>
    </>
  );
}
