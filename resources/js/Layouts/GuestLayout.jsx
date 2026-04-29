import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-surface-container-low pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-primary" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-surface-container-lowest px-lg py-md shadow-md ring-1 ring-outline-variant sm:max-w-md sm:rounded-xl">
                {children}
            </div>
        </div>
    );
}
