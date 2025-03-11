import '../css/app.css';
import './bootstrap';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Providers } from "@/providers";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({el, App, props}) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <Providers> <App {...props} /> </Providers>);

            delete el.dataset.page;
            return;
        }

        const root = createRoot(el);
        root.render(
            <Providers> <App {...props} /> </Providers>
        )

        delete el.dataset.page;
    },
    progress: {
        color: '#4B5563',
    },
});
