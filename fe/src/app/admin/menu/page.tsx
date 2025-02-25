import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TableMenu } from "@/components/menu/TableMenu";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "CMS Panel Menus Page | Property Investment",
  description: "CMS Panel Menus Page | Property Investment",
};

export default function MenuPage() {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <PageBreadcrumb pageTitle="Menus" />
      <Separator className="mb-2"/>
      <TableMenu />
      </div>
    </>
  );
}
