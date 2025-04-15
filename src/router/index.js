import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards/authGuard';
import home from '@/views/home.vue';

// Lazy-loaded components
const Login = () => import('@/components/login.vue');
const SignUP = () => import('@/components/SignUp.vue');
const testPage = () => import('@/views/testPage.vue');
const admin = () => import('@/views/admin/index.vue');
const about = () => import('@/views/about.vue');
const contactUs = () => import('@/views/contactUs.vue');
const dashboard = () => import('@/views/dashboard.vue');
const points = () => import('@/views/points.vue');
const NotFound = () => import('@/views/404.vue');
const EditProfile = () => import('@/views/editProfile/editProfile.vue');

// Router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUP,
      meta: { requiresAuth: false },
    },
    {
      path: '/test/:subject/:level',
      name: 'TestPage',
      component: testPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: {
        requiresAuth: true,
        requiresAdmin: true, // Добавляем специальную защиту для админ панели
      },
    },
    {
      path: '/about',
      name: 'aboutUs',
      component: about,
      meta: { requiresAuth: false }, // Публичная страница
    },
    {
      path: '/contact-us',
      name: 'contactUs',
      component: contactUs,
      meta: { requiresAuth: false }, // Публичная страница
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/points',
      name: 'points',
      component: points,
      meta: { requiresAuth: true },
    },
    {
      path: '/edit-profile',
      name: 'editProfile',
      component: EditProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
      meta: { requiresAuth: false },
    },
  ],
});

// Auth guard
router.beforeEach(authGuard);

export default router;
