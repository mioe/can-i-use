import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

import ErrorPage from '~/error-page.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		...routes,
		{ path: '/:pathMatch(.*)*', name: 'error-page', component: ErrorPage },
	],
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		}
		else {
			return { top: 0 }
		}
	},
})

export {
	router,
}
