import { AuthForm } from '@/components/auth/authform'
import { CardWrapper } from '@/components/auth/cardwrapper'

export default function Page() {
    return (
        <CardWrapper
            title='Sign Up'
            description='Please sign up to continue'
            includeIcons
        >
            <AuthForm isSignUp />
        </CardWrapper>
    )
}