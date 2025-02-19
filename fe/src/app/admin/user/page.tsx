import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableUser from "@/components/user/TableUser";

import React from "react";

export default function User() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Users" />
        <TableUser />
      </div>
    </div>
  );
}
