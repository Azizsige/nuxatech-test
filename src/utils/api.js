import { ofetch } from 'ofetch';
import { showMessage } from './message-service';

export const $api = ofetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    async onRequest({ options }) {
        const accessToken = useCookie('taskNuxa').value;
        if (accessToken) {
            options.headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };
        }
    },
    async onRequestError({ request, options, error }) {
        showMessage({ message: 'Gagal terkoneksi ke API', args: error ?? [], color: 'error' });

        alert('Gagal terkoneksi ke API');

        if (!navigator.onLine) {
            showMessage({ message: 'Tidak ada koneksi internet', args: error ?? [], color: 'error' });
            alert('Tidak ada koneksi internet');
            console.log('Tidak ada koneksi internet');
        }

        // Log error
        console.log('[fetch request error]', request, error);
    },
    async onResponse({ request, response, options }) {
        if (response._data == 'Invalid token') {
            // showSessionExp();
        }
        if (response.status >= 400 && response.status <= 500) {
            showMessage({ message: response._data.error, args: response._data.detail ?? [], color: 'error' });
        }
        if (response.status >= 200 && response.status <= 299) {
            showMessage({ message: response._data.message ?? 'Success', color: 'success' });
        }

        // Log response
        console.log('[fetch response]', request, response);
    }
});
