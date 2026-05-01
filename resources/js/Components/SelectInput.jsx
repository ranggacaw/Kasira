import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'touch-input rounded-md border-outline-variant bg-surface-container-lowest text-on-surface shadow-sm focus:border-primary focus:ring-primary focus:ring-1 cursor-pointer ' +
                className
            }
            ref={localRef}
        />
    );
});
