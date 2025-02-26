"use client";
import { FilePlus } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { DynamicTable } from "../tables/DynamicTable"
import React, { useState } from "react"
import { MenuModel, TreeNode } from "@/models/menu"
import { DynamicTableColumn } from "@/models/table"
import { getMenus } from "@/app/admin/menu/actions"
import { toast } from "react-toastify"
import LoadingFullpage from "@/components/ui/loading/LoadingFullPage";
import { DraggableMenu } from "./ListMenu";


const columns: DynamicTableColumn[] = [
    {
        label: "Name",
        name: "name",
    },
    {
        label: "Description",
        name: "description",
    },
    {
        label: "Parent",
        name: "parent_id",
    },
    {
        label: "Created At",
        name: "created_at",
    },
    {
        label: "Updated At",
        name: "updated_at",
    },
]

export const TableMenu = () => {

    const [menus, setMenus] = useState<TreeNode[]>([])
    const [isPending, startTransition] = React.useTransition();
    React.useEffect(() => {
        startTransition(async () => {
            try {
                const res = await getMenus()
                
                if (res.ok) {
                    if(res?.data?.data?.length>0) {
                        setMenus(res.data?.data?.map((item: MenuModel) => ({ 
                            id: item.id, 
                            name: item.name, 
                            icon: item.icon, 
                            children: item.childs?.map((chd: MenuModel) => ({
                                id: chd.id, 
                                name: chd.name, 
                                icon: chd.icon
                            })) })))
                    }
                }
                
            } catch (err: any) {
                console.log(err)
                toast.error(err.message)
            }
        })
    }, [])
    
    return (<>
        <div className="flex">
            <LoadingFullpage isShown={isPending} />
           <Link href={'/admin/menu/create'} className="ml-auto">
           <Button><FilePlus /> Add </Button>
           </Link>
        </div>
        <div className="max-w-full overflow-x-auto mt-2">
            {/* <DynamicTable
                data={menus}
                columns={columns}
                footer={false}
            /> */}
            <DraggableMenu menus={menus}/>
        </div>
    </>)
}