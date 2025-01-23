import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: Echo;
        Pusher: Pusher;
    }

    /* eslint-disable no-var */
    let route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
