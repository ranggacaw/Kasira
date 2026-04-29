export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-lg py-sm text-label-bold text-on-primary transition duration-150 ease-in-out hover:bg-primary-container hover:text-on-primary-container focus:bg-primary-container focus:text-on-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary ${
                    disabled ? 'opacity-25' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
