import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-on-surface">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant sm:rounded-lg sm:p-4">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    <div className="bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant sm:rounded-lg sm:p-4">
                        <UpdatePasswordForm className="" />
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant sm:rounded-lg sm:p-4">
                    <DeleteUserForm className="" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
