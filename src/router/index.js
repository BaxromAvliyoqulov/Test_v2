import { createRouter, createWebHistory } from "vue-router";

import home from "@/views/home.vue";
import testPage from "@/views/testPage.vue";

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
	],
});

export default router;
