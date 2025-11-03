"use client"

import { useState, useTransition } from "react"

import { useParams, useRouter } from "next/navigation"

import { Edit, Copy, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

import { MoreHorizontal } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BillboardColumn } from "./columns"
import axios from "axios"
import { toast } from "sonner"
import { AlertModal } from "@/components/alert-modal"

interface CellActionProps {
    data: BillboardColumn
}

export const CellAction = ({ data }: CellActionProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId } = useParams();

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/billboards/${data.id}`)
            startTransition(() => {
                router.refresh();
            });
            toast("Billboard has been deleted", {
                action: {
                    label: "Close",
                    onClick: () => { },
                },
            })
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                toast(err.response?.data || 'An error occurred', {
                    description: err.message,
                    action: {
                        label: "Close",
                        onClick: () => { },
                    },
                })
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(data.id)
                            .then(() => {
                                toast.success("Billboard ID copied to clipboard");
                            })
                            .catch(() => {
                                toast.error("Failed to copy Billboard ID");
                            });
                    }}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Billboard Id
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        router.push(`/${storeId}/billboards/${data.id}`)
                    }}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Billboard
                </DropdownMenuItem>
                <AlertModal
                    item="Billboard"
                    action="delete"
                    handler={onHandleDelete}
                >
                    <DropdownMenuItem
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Billboard
                    </DropdownMenuItem>
                </AlertModal>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
