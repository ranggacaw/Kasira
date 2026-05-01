import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Kasira';

const syncDisplayMode = () => {
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    document.documentElement.dataset.displayMode = isStandalone ? 'standalone' : 'browser';
    document.documentElement.classList.toggle('standalone-shell', isStandalone);
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        syncDisplayMode();

        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});

        const displayModeMedia = window.matchMedia('(display-mode: standalone)');

        if (displayModeMedia.addEventListener) {
            displayModeMedia.addEventListener('change', syncDisplayMode);
        } else if (displayModeMedia.addListener) {
            displayModeMedia.addListener(syncDisplayMode);
        }

        window.addEventListener('appinstalled', syncDisplayMode);
    });
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
