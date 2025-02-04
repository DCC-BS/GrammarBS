export type Config = {
    apiUrl: string;
}

export function useConfig(): Config {
    const app = useNuxtApp();
    return app.$grammarConfig as Config;
}

export const createConfig = () => {
    return {
        apiUrl: process.env.API_URL
    }
}
