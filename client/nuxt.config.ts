// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    colorMode: {
        preference: 'light',
    },
    modules: ['@nuxt/ui', '@nuxtjs/i18n'],
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
        vueI18n: './i18n.config.ts'
    }
})
