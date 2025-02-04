export type ApiMethod = "POST" | "GET" | "PUT" | "DELETE" | "HEAD" | "PATCH" | "CONNECT" | "OPTIONS" | "TRACE";

export function useApiFetch<T>(
    relativeUrl: string,
    body: string,
    method: ApiMethod = "POST",
    debug: boolean = false) {

    const config = useRuntimeConfig();
    return $fetch<T>(`${config.public.apiUrl}${relativeUrl}`, {
        method: method as any,
        body: body,

        // Add onRequest hook to see request details
        onRequest({ request, options }) {
            if (debug) {
                console.log('Starting Request:', {
                    request,
                    options,
                    url: options.baseURL! + request,
                    body: options.body
                });
            }
        },

        // Add onResponse hook to see response
        onResponse({ request, response, options }) {
            if (debug) {
                console.log('Response received:', {
                    request,
                    status: response.status,
                    data: response._data,
                    headers: response.headers
                });
            }
        },
        // Add onRequestError hook to see detailed errors
        onRequestError({ request, error, options }) {
            if (debug) {
                console.error('Request error:', error);
            }
        },
        // Add onResponseError hook for error responses (4xx, 5xx)

        onResponseError({ request, response, options }) {
            if (debug) {
                console.error('Response error:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: response._data
                });
            }
        }
    });
}
