"use client";

import React, { useState } from "react";
import { Store } from "@prisma/client";
import { useModalStore } from "../../hooks/use-modal";
import { useParams, useRouter } from "next/navigation";

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CommandSeparator } from "cmdk";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    stores: Store[]
}

export const StoreSwitcher = ({
    stores = [],
    className
}: StoreSwitcherProps) => {
    const [open, setOpen] = useState(false);

    const modalStore = useModalStore();
    const params = useParams();
    const router = useRouter();

    const formattedStores = stores.map((store) => ({
        label: store.name,
        value: store.id,
    }));

    const currentStore = formattedStores.find(
        (store) => store.value === params.storeId
    );

    const onStoreSelect = (store: { label: string, value: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>

            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="opacity-50" />
                    {currentStore
                        ? currentStore.label
                        : "Select store..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search store..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedStores.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    value={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                >
                                    <StoreIcon className="mr-2 w-4 h-4 opacity-50" />
                                    {store.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                value="create-store"
                                onSelect={() => {
                                    setOpen(false);
                                    modalStore.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 w-4 h-4 opacity-50" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
