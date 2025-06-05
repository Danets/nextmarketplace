
type SuccessToasterProps = {
    success?: string | null;
};

export const SuccessToaster = ({ success }: SuccessToasterProps) => {
    if (!success) return null;

    return (
        <div
            className="bg-emerald-500 text-white px-4 py-2 rounded shadow-md"
            role="alert"
        >
            {success}
        </div>
    );
};
