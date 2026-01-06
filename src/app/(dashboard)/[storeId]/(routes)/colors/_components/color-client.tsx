"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { ColorColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/api-list";

interface ColorsClientProps {
    colors: ColorColumn[];
}

export const ColorsClient = ({ colors }: ColorsClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Colors (${colors.length})`}
                    description="Manage colors for your store"
                />
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/${storeId}/colors/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={colors} searchKey="name" />
            </div>
            <Heading
                title="API"
                description="API calls for colors"
            />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}