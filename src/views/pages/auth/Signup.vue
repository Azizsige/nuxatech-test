<script setup>
import { ref } from 'vue';

const email = ref('eve.holt@reqres.in');
const password = ref('pistol');
const isLoading = ref(false);
const router = useRouter();

const register = async () => {
    isLoading.value = true;
    try {
        // Base URL bisa disesuaikan di sini, jika perlu
        const api = createApiInstance(import.meta.env.VITE_API_BASE_URL || '/api'); // Atau gunakan base URL default

        // Melakukan request dengan POST untuk register
        const res = await api('/register', {
            method: 'POST',
            body: { email: email.value, password: password.value }
        });

        console.log('res :', res);

        // Menyimpan token di cookie dan redirect ke dashboard
        if (res && res.token) {
            useCookie('taskNuxa').value = res.token;
            router.push({ name: 'homepage' });
        } else {
            // Menangani kasus error jika token tidak ada
            errors.value.username = 'Email/Password Salah';
            errors.value.password = 'Email/Password Salah';
        }
    } catch (err) {
        console.error('Register error:', err);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Panel header="User Credential" class="w-[25rem] position-absolute absolute">
        <p class="m-0">Email : eve.holt@reqres.in</p>
        <p class="m-0">Password : pistol</p>
    </Panel>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full px-8 py-20 bg-surface-0 dark:bg-surface-900 sm:px-20" style="border-radius: 53px">
                    <div class="mb-8 text-center">
                        <span class="font-medium text-muted-color">Register to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Email</label>
                        <InputText autofocus id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        <Button label="Register" class="w-full mt-3 bg-white" @click="register"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
