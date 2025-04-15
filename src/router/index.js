import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './middleware'; // Import middleware

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' }, // ✅ Tambahkan redirect ke login
        { path: '/login', name: 'login', component: () => import('@/views/pages/auth/Login.vue') },
        { path: '/register', name: 'register', component: () => import('@/views/pages/auth/Signup.vue') },
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                { path: '/users', name: 'users', meta: { requiresAuth: true }, component: () => import('@/views/Dashboard.vue') },
                { path: '/homepage', name: 'homepage', meta: { requiresAuth: true }, component: () => import('@/views/Homepage.vue') },
                { path: '/uikit/overlay', name: 'overlay', meta: { requiresAuth: true }, component: () => import('@/views/uikit/OverlayDoc.vue') },
                { path: '/uikit/media', name: 'media', meta: { requiresAuth: true }, component: () => import('@/views/uikit/MediaDoc.vue') },
                { path: '/uikit/message', name: 'message', meta: { requiresAuth: true }, component: () => import('@/views/uikit/MessagesDoc.vue') },
                { path: '/uikit/file', name: 'file', meta: { requiresAuth: true }, component: () => import('@/views/uikit/FileDoc.vue') },
                { path: '/uikit/menu', name: 'menu', meta: { requiresAuth: true }, component: () => import('@/views/uikit/MenuDoc.vue') },
                { path: '/uikit/charts', name: 'charts', meta: { requiresAuth: true }, component: () => import('@/views/uikit/ChartDoc.vue') },
                { path: '/uikit/misc', name: 'misc', meta: { requiresAuth: true }, component: () => import('@/views/uikit/MiscDoc.vue') },
                { path: '/uikit/timeline', name: 'timeline', meta: { requiresAuth: true }, component: () => import('@/views/uikit/TimelineDoc.vue') },
                { path: '/pages/empty', name: 'empty', meta: { requiresAuth: true }, component: () => import('@/views/pages/Empty.vue') },
                { path: '/pages/crud', name: 'crud', meta: { requiresAuth: true }, component: () => import('@/views/pages/Crud.vue') },
                { path: '/documentation', name: 'documentation', meta: { requiresAuth: true }, component: () => import('@/views/pages/Documentation.vue') }
            ]
        },
        { path: '/landing', name: 'landing', component: () => import('@/views/pages/Landing.vue') },
        { path: '/pages/notfound', name: 'notfound', component: () => import('@/views/pages/NotFound.vue') },
        { path: '/auth/access', name: 'accessDenied', component: () => import('@/views/pages/auth/Access.vue') },
        { path: '/auth/error', name: 'error', component: () => import('@/views/pages/auth/Error.vue') },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/pages/NotFound.vue') }
    ]
});

// Gunakan Middleware
router.beforeEach(authGuard);

export default router;
