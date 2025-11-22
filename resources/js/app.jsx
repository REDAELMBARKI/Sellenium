import '../css/app.css';
import './bootstrap';

import { createInertiaApp, Link } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ProductFormProvider } from './contextProvoders/ProductFormProvider';
import { TagsProvider } from './contextProvoders/TagsProvider';
import { InventoryProvider } from './contextProvoders/InventoryProvider';
import { MediaProvider } from './contextProvoders/MediaProvider';
window.Link = Link
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(   <App {...props} />);
    }
   ,
    progress: {
        color: '#006affff',
    },
});
