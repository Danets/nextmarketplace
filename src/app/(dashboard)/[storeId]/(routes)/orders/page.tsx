import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";

import { OrderClient } from "./_components/order-client";
import { OrderColumn } from "./_components/columns";

export default async function OrdersPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const orders = await prisma.order.findMany({
        where: { storeId },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        phone: order.phone,
        products: order.orderItems.map((item) => item.product.name).join(", "),
        address: order.address,
        totalPrice: priceFormatter.format(order.orderItems.reduce((total, item) => total + (+item.product.price * item.quantity), 0)),
        isPaid: order.isPaid ? "Yes" : "No",
        createdAt: format(order.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient orders={formattedOrders} />
            </div>
        </div>
    )
}