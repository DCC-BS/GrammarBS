// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    colorMode: {
        preference: 'light',
    },
    modules: ['@nuxt/ui', '@nuxtjs/i18n', '@vite-pwa/nuxt', '@nuxtjs/mdc'],
    css: ['~/assets/css/main.scss'],
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL,
        }
    },
    // localization
    i18n: {
        locales: ['en', 'de'],
        defaultLocale: 'de',
        vueI18n: './i18n.config.ts',
        lazy: true,
    },
    nitro: {
        node: true,
        prerender: {
            routes: ['/']
        }
    },
    pwa: {
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
            globIgnores: ['dev-sw-dist/**/*'],
            navigateFallback: '/',
        },
        client: {
            periodicSyncForUpdates: 60 * 10, // 10 minutes
        },
        manifest: {
            name: 'Grammar BS',
            short_name: 'Grammar BS',
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
    },
    $development: {
        pwa: {
            devOptions: {
                enabled: true,
            },
        },
        devtools: { enabled: true },
    }
})
