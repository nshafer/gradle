import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import GitRevision from 'vite-plugin-git-revision';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        GitRevision({}),
        VitePWA({
            includeAssets: [
                'favicon.ico', 'favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                "id": "/",
                "name": "Wordle Helper",
                "short_name": "Wordle Helper",
                "description": "Help you solve Wordle",
                "theme_color": "#ffffff",
                "icons": [
                    {
                        "src": "/android-chrome-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/android-chrome-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ],
            },
            registerType: 'prompt',
            workbox: {
                offlineGoogleAnalytics: true,
            },
            devOptions: {
                enabled: false
            }
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
