import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-3">
            <div>
                <InputLabel htmlFor="name" value="Name" />

                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    isFocused
                    autoComplete="name"
                />

                <InputError className="mt-2" message={errors.name} />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="username"
                />

                <InputError className="mt-2" message={errors.email} />
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div>
                    <p className="text-sm text-on-surface-variant">
                        Your email address is unverified.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ml-1 text-on-surface-variant underline hover:text-on-surface"
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                            A new verification link has been sent to your
                            email address.
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between">
                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-on-surface-variant">
                        Saved.
                    </p>
                </Transition>
            </div>
        </form>
        </section>
    );
}
