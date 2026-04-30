export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-md border border-outline bg-surface px-lg py-sm text-label-bold text-on-surface shadow-sm transition duration-150 ease-in-out hover:bg-surface-container hover:border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-25 cursor-pointer ${
                    disabled ? 'opacity-25' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
