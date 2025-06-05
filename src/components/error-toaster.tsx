
type ErrorToasterProps = {
    error?: string | null;
};

export const ErrorToaster = ({ error }: ErrorToasterProps) => {
    if (!error) return null;

    return (
        <div
            className="bg-red-500 text-white px-4 py-2 rounded shadow-md"
            role="alert"
        >
            {error}
        </div>
    );
};
