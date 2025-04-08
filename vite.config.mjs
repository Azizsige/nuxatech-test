import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: { noDiscovery: true },
    plugins: [
        vue(), // ✅ Pastikan Vue dideklarasikan setelah VueRouter
        Components({ dirs: ['src/components'], dts: true, resolvers: [PrimeVueResolver()] }),
        AutoImport({
            imports: ['vue', '@vueuse/core', 'pinia', 'vue-router'],
            dirs: ['./src/@core/utils', './src/@core/composables/', './src/utils/'],
            vueTemplate: true,
            dts: './auto-imports.d.ts',
            eslintrc: { enabled: true, filepath: './.eslintrc-auto-import.json' }
        })
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
        chunkSizeWarningLimit: 5000,
        rollupOptions: {
            output: {
                inlineDynamicImports: false, // ✅ Perbaiki typo dari "inlineDynamiceImports"
                manualChunks(id) {
                    const whitelist = ['vue', 'vue-router', 'primevue', 'pinia'];

                    const isInWhitelist = (module) => whitelist.some((item) => module.includes(item));

                    if (typeof id === 'string' && isInWhitelist(id)) {
                        const parts = id.toString().split('node_modules/');
                        if (parts.length > 1) {
                            return parts[1].split('/')[0];
                        }
                    }
                    return undefined; // ✅ Tambahkan return agar tidak error
                }
            }
        }
    }
});
