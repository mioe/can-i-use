import { localize } from '@vee-validate/i18n'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'

defineRule('required', required)
configure({
	generateMessage: localize({
		en: {
			messages: {
				required: 'test',
			},
		},
		ar: {
			messages: {
				required: 'هذا الحقل مطلوب',
			},
		},
	}),
})
