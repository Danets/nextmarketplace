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
import { CategoryColumn } from "./columns"
import axios from "axios"
import { toast } from "sonner"
import { useModalCellAction } from "../../../../../../../hooks/use-modal"
import { Modal } from "@/components/modal"

interface CellActionProps {
    data: CategoryColumn
}

export const CellAction = ({ data }: CellActionProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const modal = useModalCellAction();

    const router = useRouter()
    const { storeId } = useParams();

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/categories/${data.id}`)
            startTransition(() => {
                router.refresh();
            });
            toast("Category has been deleted", {
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
            modal.onClose();
        }
    }

    return (
        <>
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
                                    toast.success("Category ID copied to clipboard");
                                })
                                .catch(() => {
                                    toast.error("Failed to copy Category ID");
                                });
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Category Id
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            router.push(`/${storeId}/categories/${data.id}`)
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Update Category
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => modal.onOpen()}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Category
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                title="Are you sure?"
                description="This action cannot be undone."
                isOpen={modal.isOpen}
                onClose={modal.onClose}
            >
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button
                        disabled={loading || isPending}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={modal.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading || isPending}
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={onHandleDelete}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Modal>
        </>

    )
}
