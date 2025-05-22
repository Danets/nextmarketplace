import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const font = Poppins({ weight: '600', subsets: ['latin'] });

interface HeaderProps {
    title: string;
}

export const Header = ({
    title
}: HeaderProps) => {
    return (
        <div className='flex flex-col items-center justify-center gap-y-4 w-full'>
            <h1 className={cn('text-4xl text-center', font.className)}>
                Authentification
            </h1>
            <p className='text-sm text-muted-foreground'>
                {title}
            </p>
        </div>
    )
}