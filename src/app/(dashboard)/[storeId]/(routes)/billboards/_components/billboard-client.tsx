"use client"
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { Billboard } from "@prisma/client";

interface BillboardClientProps {
    billboards: Billboard[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${billboards.length})`}
                    description="Manage billboards for your store"
                />
                <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add new
                </Button>
            </div>
            <ul>
                {billboards.length > 0 ?
                    (billboards.map((billboard: Billboard) => (
                        <li
                            key={billboard.id}
                            className="text-sm text-gray-600 hover:cursor-pointer hover:bg-indigo-700"
                            onClick={() => router.push(`/${storeId}/billboards/${billboard.id}`)}
                        >
                            {billboard.label}
                        </li>
                    ))) : "Loading..."
                }
            </ul>
            <Separator />
        </>
    )
}