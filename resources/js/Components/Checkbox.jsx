export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-outline-variant bg-surface-container-lowest text-primary shadow-sm focus:ring-primary focus:ring-1 cursor-pointer ' +
                className
            }
        />
    );
}
