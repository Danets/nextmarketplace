import { prisma } from "@/lib/db";
import { ProductForm } from "../_components/product-form";

export default async function ProductDetailedPage({ params }: { params: Promise<{ productId: string, storeId: string }> }) {
    const productId = (await params).productId;
    const storeId = (await params).storeId;

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            images: true,
        },
    });

    const categories = await prisma.category.findMany({
        where: {
            storeId: storeId,
        },
    });

    const sizes = await prisma.size.findMany({
        where: {
            storeId: storeId,
        },
    });

    const colors = await prisma.color.findMany({
        where: {
            storeId: storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <ProductForm
                    initialData={product}
                    categories={categories}
                    sizes={sizes}
                    colors={colors} />
            </div>
        </div>)
}
