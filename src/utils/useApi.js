import { createFetch } from '@vueuse/core';
import { destr } from 'destr';

export const createUseApiInstance = (baseUrl) => {
    return createFetch({
        baseUrl: baseUrl || import.meta.env.VITE_API_BASE_URL || '/api', // Gunakan baseUrl dinamis jika diberikan
        fetchOptions: {
            headers: {
                Accept: 'application/json'
            }
        },
        options: {
            refetch: true,
            async beforeFetch({ options }) {
                const accessToken = useCookie('taskDashboardTenant').value;
                if (accessToken) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${accessToken}`
                    };
                }

                return { options };
            },
            afterFetch(ctx) {
                console.log(ctx);

                const { data, response } = ctx;
                if (response.status >= 400 && response.status <= 500 && !request.includes('/api/subdomains/name')) {
                    showMessage({
                        message: data.message,
                        args: data.detail ?? [],
                        color: 'error'
                    });
                }

                // Parse data if it's JSON
                let parsedData = null;
                try {
                    parsedData = destr(data);
                } catch (error) {
                    console.error(error);
                }

                if (data === 'Invalid token') {
                    showSessionExp();
                    hideSopDialog();
                }

                return { data: parsedData, response };
            },
            onFetchError(ctx) {
                console.log('Error saat fetch:', ctx);

                const { response, error } = ctx;

                // Jika tidak ada koneksi internet
                if (!navigator.onLine) {
                    showMessage({
                        message: 'Tidak ada koneksi internet! Silakan coba lagi nanti.',
                        color: 'error'
                    });

                    return ctx;
                }

                if (response?.status === 401) {
                    showSessionExp();
                    hideSopDialog();
                }

                return ctx;
            }
        }
    });
};
