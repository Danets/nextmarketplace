import Link from 'next/link';
import { Button } from '../ui/button'

interface ButtonLinkProps {
    href: string;
    label: string;
}

export const ButtonLink = ({
    href,
    label,
}: ButtonLinkProps) => {
    return (
        <Button
            variant="link"
            size="sm"
            className='w-full font-normal'
            asChild
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}