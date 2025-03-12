import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
import axios from "axios";

declare const window: { [x: string]: any } & Window &
    typeof globalThis & { Pusher: typeof Pusher; // @ts-ignore
    Echo: Echo
};

// @ts-ignore
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (channel: any, _: any) => {
        return {
            authorize: (socketId: any, callback: any) => {
                axios.post('/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                }).then((response: any) => {
                    callback(false, response.data);
                }).catch((error: any) => {
                    callback(true, error);
                });
            }
        };
    },
});
