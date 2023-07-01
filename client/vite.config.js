import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                signup: resolve(__dirname, 'signup.html'),
                friendlist: resolve(__dirname, 'friendlist.html'),
                messages: resolve(__dirname, 'messages.html'),
                people: resolve(__dirname, 'people.html'),
                about: resolve(__dirname, 'about.html'),
            },
        },
    },
});
