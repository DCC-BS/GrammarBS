export async function safeFetch(url: string, options: RequestInit): Promise<any | Error> {
    try {
        const response = await $fetch(url, options);

        console.log('response', response);

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('API Error:', errorResponse);
            return new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Fetch Error:', error);
            return error;
        }

        return new Error('Unknown error');
    }
}
