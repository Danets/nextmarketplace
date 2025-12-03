"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/api-list";

interface CategoriesClientProps {
    categories: CategoryColumn[];
}

export const CategoryClient = ({ categories }: CategoriesClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${categories.length})`}
                    description="Manage categories for your store"
                />
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/${storeId}/categories/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={categories} searchKey="name" />
            </div>
            <Heading
                title="API"
                description="API calls for categories"
            />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}