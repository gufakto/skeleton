import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableRole from "@/components/role/TableRole";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "CMS Panel Role Page | Property Investment",
  description: "CMS Panel Role Page | Property Investment",
};

export default function RolePage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Roles" />
        <TableRole />
      </div>
    </div>
  );
}
