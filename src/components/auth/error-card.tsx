import { FaExclamationTriangle } from "react-icons/fa"
import { CardWrapper } from "./card-wrapper"

export const ErrorCard = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <CardWrapper
            title='Oops! Something went wrong'
            buttonLabel='Back to Login'
            buttonHref='sign-in'
        >
            <div className="flex items-center justify-center">
                <FaExclamationTriangle />
                {children}
            </div>
        </CardWrapper>
    )
}
