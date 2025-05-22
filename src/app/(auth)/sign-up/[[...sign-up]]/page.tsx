import { AuthForm } from '@/components/auth/auth-form'
import { CardWrapper } from '@/components/auth/card-wrapper'

export default function Page() {
    return (
        <CardWrapper
            title='Welcome back'
            buttonLabel='Do not have an account?'
            buttonHref='sign-up'
            includeIcons
        >
            <AuthForm isSignUp />
        </CardWrapper>
    )
}