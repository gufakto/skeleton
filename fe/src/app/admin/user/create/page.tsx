import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateUser from "@/components/user/CreateUser";

export default function CreatePage() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div className="space-y-6">
                <PageBreadcrumb pageTitle="Create Users" />
                <CreateUser/>
            </div>
        </div>
    )
}