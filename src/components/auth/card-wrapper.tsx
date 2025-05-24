import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Header } from "./header";
import { SocialIcons } from "./social-icons";
import { ButtonLink } from "./button-link";

interface CardWrapperProps {
    title: string;
    buttonLabel: string;
    buttonHref: string;
    children: React.ReactNode;
    includeIcons?: boolean;
}

export const CardWrapper = ({
    title,
    buttonLabel,
    buttonHref,
    children,
    includeIcons = false
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header title={title} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {includeIcons && (
                <CardFooter>
                    <SocialIcons />
                </CardFooter>
            )}
            <CardFooter>
                <ButtonLink
                    label={buttonLabel}
                    href={buttonHref}
                />
            </CardFooter>
        </Card>
    )
}