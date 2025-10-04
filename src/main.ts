import { createApp } from 'vue'
import 'uno.css'

import './style.css'
import App from './app-endpoint.vue'
import { pinia } from './modules/pinia'
import { i18n } from './modules/vue-i18n'
import { router } from './modules/vue-router'
import './modules/vee-validate'

/**
 * init app
 */
createApp(App)
	.use(i18n)
	.use(pinia)
	.use(router)
	.mount('#app')
