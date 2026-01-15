import { prisma } from "@/lib/db";
import { format } from "date-fns";

import { ProductClient } from "./_components/product-client";
import { ProductColumn } from "./_components/columns";
import { priceFormatter } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const products = await prisma.product.findMany({
        where: { storeId },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedProducts: ProductColumn[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: priceFormatter.format(product.price.toNumber()),
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        category: product.category.name,
        size: product.size.name,
        color: product.color.value,
        createdAt: format(product.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient products={formattedProducts} />
            </div>
        </div>
    )
}