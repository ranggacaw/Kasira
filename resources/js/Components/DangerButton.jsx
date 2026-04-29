export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-transparent bg-error px-lg py-sm text-label-bold text-on-error transition duration-150 ease-in-out hover:bg-error-container hover:text-on-error-container focus:bg-error-container focus:text-on-error-container focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 active:bg-error ${
                    disabled ? 'opacity-25' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
