import { prisma } from "@/lib/db";
import { CategoryForm } from "../_components/category-form";

export default async function CategoryDetailedPage({ params }: { params: Promise<{ categoryId: string, storeId: string }> }) {
    const categoryId = (await params).categoryId;
    const storeId = (await params).storeId;

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    const billboards = await prisma.billboard.findMany({
        where: {
            storeId: storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>)
}
