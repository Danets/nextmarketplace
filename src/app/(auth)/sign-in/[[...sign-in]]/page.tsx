import { AuthForm } from '@/components/auth/authform'
import { CardWrapper } from '@/components/auth/cardwrapper'

export default function Page() {
    return (
        <CardWrapper
            title='Sign In'
            description='Please sign in to continue'
            includeIcons
        >
            <AuthForm />
        </CardWrapper>
    )
}