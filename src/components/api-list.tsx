"use client"

import { useParams, useRouter } from "next/navigation"
import { useOrigin } from "../../hooks/use-origin";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList = ({
    entityName,
    entityIdName
}: ApiListProps) => {
    const router = useRouter()
    const { storeId } = useParams();

    const origin = useOrigin();

    const baseUrl = `${origin}/api/${storeId}`;

    return (
        <>
            <Alert variant="default">
                <AlertTitle>GET</AlertTitle>
                <AlertDescription>
                    {`${baseUrl}/${entityName}`}
                </AlertDescription>
            </Alert>
            <Alert variant="default">
                <AlertTitle>GET</AlertTitle>
                <AlertDescription>
                    {`${baseUrl}/${entityName}/{${entityIdName}}`}
                </AlertDescription>
            </Alert>
            <Alert variant="default">
                <AlertTitle>POST</AlertTitle>
                <AlertDescription>
                    {`${baseUrl}/${entityName}`}
                </AlertDescription>
            </Alert>
            <Alert variant="default">
                <AlertTitle>PATCH</AlertTitle>
                <AlertDescription>
                    {`${baseUrl}/${entityName}/{${entityIdName}}`}
                </AlertDescription>
            </Alert>
            <Alert variant="default">
                <AlertTitle>DELETE</AlertTitle>
                <AlertDescription>
                    {`${baseUrl}/${entityName}/{${entityIdName}}`}
                </AlertDescription>
            </Alert>
        </>

    )
}
