"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { ProductColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/api-list";

interface ProductClientProps {
    products: ProductColumn[];
}

export const ProductClient = ({ products }: ProductClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${products.length})`}
                    description="Manage products for your store"
                />
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/${storeId}/products/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={products} searchKey="name" />
            </div>
            <Heading
                title="API"
                description="API calls for products"
            />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}