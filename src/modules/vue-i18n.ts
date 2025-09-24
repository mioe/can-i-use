import type { PluralizationRule } from 'vue-i18n'

import messages from '@intlify/unplugin-vue-i18n/messages'
import Cookies from 'universal-cookie'
import { createI18n } from 'vue-i18n'

const cookies = new Cookies(null, { path: '/' })
type Locale = 'en' | 'ru'

// Russian, Ukrainian, etc
function slavicLanguagesRule(
	choice: number,
	choicesLength: number,
	_orgRule?: PluralizationRule,
) {
	// Для 0 используем множественное число (как для 5, 6, 7...)
	if (choice === 0) {
		return 0
	}

	const lastDigit = choice % 10
	const lastTwoDigits = choice % 100

	// 1, 21, 31, 41... (но не 11) - единственное число
	if (lastDigit === 1 && lastTwoDigits !== 11) {
		return 1
	}

	// 2-4, 22-24, 32-34... (но не 12-14) - двойственное число
	if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
		return 2
	}

	// Все остальные (5-20, 25-30, etc.) - множественное число
	return choicesLength < 4 ? 2 : 3
}

function isAvailableLanguageTypeGuard(lang: string | null): lang is Locale {
	return lang !== null && ['en', 'ru'].includes(lang)
}

export function detectDefaultLocale(): Locale {
	const cookieLang = cookies.get('lang')
	if (isAvailableLanguageTypeGuard(cookieLang)) {
		return cookieLang
	}

	return 'en'
}

export const i18n = createI18n({
	locale: detectDefaultLocale(),
	pluralRules: {
		ru: slavicLanguagesRule,
	},
	messages,
})
