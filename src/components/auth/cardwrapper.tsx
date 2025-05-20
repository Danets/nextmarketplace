import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { FaGoogle, FaGithub } from "react-icons/fa"

interface CardWrapperProps {
    title: string;
    description: string;
    children: React.ReactNode;
    includeIcons?: boolean;
}

export const CardWrapper = ({
    title,
    description,
    children,
    includeIcons = false
}: CardWrapperProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {includeIcons && (
                <CardFooter>
                    <div className="flex items-center justify-between gap-x-2">
                        <Button className="shadow">
                            <FaGoogle className="h-4 w-4" />
                            Google
                        </Button>
                        <Button className="shadow">
                            <FaGithub className="h-4 w-4" />
                            GitHub
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}