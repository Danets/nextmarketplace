"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/api-list";

interface BillboardClientProps {
    billboards: BillboardColumn[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${billboards.length})`}
                    description="Manage billboards for your store"
                />
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={billboards} searchKey="label" />
            </div>
            <Heading
                title="API"
                description="API calls for billboards"
            />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    )
}