import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { EditRole } from "@/components/role/EditRole";
import { Metadata } from "next";
import { getRole } from "../actions";
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "CMS Panel Role Page | Property Investment",
  description: "CMS Panel Role Page | Property Investment",
};

const EditRolePage = async ({params}: {params: {id: string}}) => {
    const {id} = await params
    const {ok, data} = await getRole(id)
    
    return (<>
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Edit Role" />
            <EditRole data={data?.data} />
        </div>
    </div>
    </>)
}

export default EditRolePage;