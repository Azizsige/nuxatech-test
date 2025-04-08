export function authGuard(to, from, next) {
    const isAuthenticated = useCookie('taskNuxa').value;
    const lastVisited = useStorage('lastVisited', '');

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            lastVisited.value = to.fullPath; // Simpan halaman terakhir sebelum logout
            next(`/login?redirect=${encodeURIComponent(to.fullPath)}`); // Pastikan pakai "redirect"
        } else {
            next();
        }
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
}
