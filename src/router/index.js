import { createRouter, createWebHistory } from "vue-router";

// all components
import home from "@/views/home.vue";
const admin = () => import('@/views/admin/index.vue')
// 
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: home,
		},
		{
			path: '/admin',
			name: 'admin',
			component: admin
		}
	],
});

export default router;
