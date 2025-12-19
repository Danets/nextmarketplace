"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { SizeColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/api-list";

interface SizesClientProps {
    sizes: SizeColumn[];
}

export const SizesClient = ({ sizes }: SizesClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${sizes.length})`}
                    description="Manage sizes for your store"
                />
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/${storeId}/sizes/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={sizes} searchKey="name" />
            </div>
            <Heading
                title="API"
                description="API calls for sizes"
            />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    )
}