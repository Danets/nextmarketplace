import { prisma } from "@/lib/db";
import { format } from "date-fns";

import { CategoryClient } from "./_components/category-client";
import { CategoryColumn } from "./_components/columns";

export default async function CategoriesPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const categories = await prisma.category.findMany({
        where: { storeId },
        include: { billboard: true },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient categories={formattedCategories} />
            </div>
        </div>
    )
}