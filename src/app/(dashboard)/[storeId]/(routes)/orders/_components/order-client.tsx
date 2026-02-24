"use client"

import { Heading } from "@/components/heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface OrderClientProps {
    orders: OrderColumn[];
}

export const OrderClient = ({ orders }: OrderClientProps) => {

    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description="Manage orders for your store"
            />

            <Separator />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={orders} searchKey="label" />
            </div>
        </>
    )
}