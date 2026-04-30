import { Link } from '@inertiajs/react';

const SidebarItem = ({ icon, label, href, active, hiddenLabelClass = 'hidden lg:block', method, as = 'a', onClick }) => (
    <Link
        href={href}
        method={method}
        as={as}
        onClick={onClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
            active
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container'
        }`}
    >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
        <span className={`${hiddenLabelClass} text-sm font-medium`}>{label}</span>
    </Link>
);

export default function AppSidebar({
    className = '',
    brandHref,
    initials,
    brandTitle,
    brandSubtitle,
    userName,
    roleName,
    planName,
    navigation = [],
    footerItems = [],
    collapsed = false,
    responsiveLabels = true,
    headerAction = null,
    onNavigate,
}) {
    const hiddenLabelClass = collapsed ? 'sr-only' : responsiveLabels ? 'hidden lg:block' : 'block';

    return (
        <aside className={`flex flex-col overflow-hidden border-r border-outline-variant bg-white ${className}`}>
            <div className="border-b border-outline-variant p-4">
                <div className="flex items-center justify-between gap-3">
                    <Link href={brandHref} onClick={onNavigate} className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-label-bold text-on-primary-container">
                            {initials}
                        </div>
                        {!collapsed && (
                            <div className={`${responsiveLabels ? 'hidden lg:block' : 'block'} overflow-hidden`}>
                                <p className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-primary">{brandTitle}</p>
                                <p className="whitespace-nowrap text-sm font-semibold text-on-surface">{brandSubtitle}</p>
                            </div>
                        )}
                    </Link>
                    {headerAction}
                </div>
            </div>

            <div className="border-b border-outline-variant p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-bold text-on-primary-container">
                        {initials}
                    </div>
                    {!collapsed && (
                        <div className={`${responsiveLabels ? 'hidden lg:block' : 'block'} min-w-0 flex-1 overflow-hidden`}>
                            <p className="truncate text-sm font-semibold text-on-surface">{userName}</p>
                            <div className="mt-0.5 flex items-center gap-2">
                                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold text-on-secondary-container">
                                    {roleName}
                                </span>
                                {planName && (
                                    <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-semibold text-on-tertiary">
                                        {planName}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navigation.map((item) => (
                    <SidebarItem
                        key={item.key}
                        icon={item.icon}
                        label={item.name}
                        href={item.href}
                        active={item.active}
                        hiddenLabelClass={hiddenLabelClass}
                        onClick={onNavigate}
                    />
                ))}
            </nav>

            <div className="border-t border-outline-variant p-4">
                <div className="space-y-1">
                    {footerItems.map((item) => (
                        <SidebarItem
                            key={item.key}
                            icon={item.icon}
                            label={item.name}
                            href={item.href}
                            active={false}
                            hiddenLabelClass={hiddenLabelClass}
                            method={item.method}
                            as={item.as}
                            onClick={onNavigate}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}
