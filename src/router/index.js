import { createRouter, createWebHistory } from "vue-router";

import home from "@/views/home.vue";
const Login = () => import('@/components/login.vue');
const SignUP = () => import('@/components/SignUp.vue');
const testPage = () => import("@/views/testPage.vue");
const admin = () => import('@/views/admin/index.vue');
const about = () => import('@/views/about.vue');
const contactUs = () => import('@/views/contactUs.vue');
const dashboard = () => import('@/views/dashboard.vue');
const points = () => import('@/views/points.vue');
const shop = () => import('@/views/shop/shop.vue');

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: home,
		},
		{
			path: "/test",
			name: "testPage",
			component: testPage,
		},
		{
			path: '/admin',
			name: 'admin',
			component: admin
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/SignUp',
			name: 'SignUp',
			component: SignUP
		},
		{
			path: '/about',
			name: 'aboutUs',
			component: about
		},
		{
			path: '/contactUs',
			name: 'contactUs',
			component: contactUs
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: dashboard
		},
		{
			path:'/points',
			name:'points',	
			component: points
		},
		{
			path:'/shop',
			name:'shop',		
			component: shop
		},
	],
});

export default router;
