// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    colorMode: {
        preference: 'light',
    },
    modules: ['@nuxt/ui', '@nuxtjs/i18n', '@vite-pwa/nuxt', '@nuxtjs/mdc'],
    css: ['~/assets/css/main.scss'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        // Public keys that are exposed to the client
        public: {
            apiUrl: process.env.API_URL,
        }
    },
    i18n: {
        locales: ['en', 'de'],
        defaultLocale: 'de',
        vueI18n: './i18n.config.ts',
        lazy: true,
    },
    pwa: {
        registerType: 'autoUpdate',
        client: {
            periodicSyncForUpdates: 60 * 10, // 10 minutes
        },
        devOptions: {
            enabled: true,
        },
        manifest: {
            name: 'Grammar Editor',
            short_name: 'Grammar Editor',
            description: 'Grammar Editor',
            theme_color: '#000000',
            background_color: '#000000',
            icons: [
                {
                    src: '/HeroiconsLanguage.png',
                    sizes: '512x512',
                },
            ],

            shortcuts: [
                {
                    name: 'From Clipboard',
                    url: '/?clipboard=true',
                    icons: [{ src: '/MaterialSymbolsContentPasteGo.png', sizes: '512x512' }],
                },
            ],
        },
    }
})
