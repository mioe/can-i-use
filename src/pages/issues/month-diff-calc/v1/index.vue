<script setup lang="ts">
import type { Dayjs } from 'dayjs'

import dayjs from 'dayjs'

const costPerPiece = ref(500)
const initCount = ref(4)
const newCount = ref(4)
const months = ref(2)

const x = ref('2025-08-01')
const y = ref(dayjs().format('YYYY-MM-DD'))

const monthlyCost = computed(() => {
	const value = Number(costPerPiece.value)
	return Number.isFinite(value) && value > 0 ? value : 0
})

const initialLicenseCount = computed(() => {
	const value = Number(initCount.value)
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
})

const desiredLicenseCount = computed(() => {
	const value = Number(newCount.value)
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
})

const monthsToBill = computed(() => {
	const value = Number(months.value)
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
})

const parsedLastPurchase = computed<Dayjs | null>(() => (x.value ? dayjs(x.value) : null))
const parsedCurrentDate = computed<Dayjs | null>(() => (y.value ? dayjs(y.value) : null))

const daysDifference = computed(() => {
	if (!parsedLastPurchase.value || !parsedCurrentDate.value) {
		return null
	}

	return parsedCurrentDate.value.startOf('day').diff(
		parsedLastPurchase.value.startOf('day'),
		'day',
	)
})

function buildMonthlyPeriods(start: Dayjs, count: number) {
	return Array.from({ length: count }, (_, index) => {
		const periodStart = start.add(index, 'month')
		const periodEnd = periodStart.add(1, 'month')
		const days = periodEnd.diff(periodStart, 'day')

		return {
			key: `${periodStart.format('YYYY-MM-DD')}-${periodEnd.format('YYYY-MM-DD')}`,
			start: periodStart,
			end: periodEnd,
			days,
			dailyCost: days > 0 ? monthlyCost.value / days : 0,
		}
	})
}

const invoicePeriods = computed(() => {
	if (!parsedCurrentDate.value || monthsToBill.value <= 0 || monthlyCost.value <= 0) {
		return []
	}

	return buildMonthlyPeriods(parsedCurrentDate.value.startOf('day'), monthsToBill.value)
})

const dailyCostBreakdown = computed(() =>
	invoicePeriods.value.map(period => ({
		key: period.key,
		label: `${period.start.format('DD MMM YYYY')} → ${period.end.format('DD MMM YYYY')}`,
		days: period.days,
		dailyCost: period.dailyCost,
	})),
)

const rawDiscount = computed(() => {
	if (
		!parsedLastPurchase.value
		|| !parsedCurrentDate.value
		|| monthsToBill.value <= 0
		|| initialLicenseCount.value <= 0
		|| monthlyCost.value <= 0
	) {
		return 0
	}

	const coverageStart = parsedLastPurchase.value.startOf('day')
	const referencePoint = parsedCurrentDate.value.startOf('day')

	return buildMonthlyPeriods(coverageStart, monthsToBill.value).reduce((sum, period) => {
		if (!period.end.isAfter(referencePoint)) {
			return sum
		}

		const effectiveStart = referencePoint.isAfter(period.start) ? referencePoint : period.start
		const unusedDays = period.end.diff(effectiveStart, 'day')

		if (unusedDays <= 0 || period.days <= 0) {
			return sum
		}

		const perLicenseUnused = unusedDays * (monthlyCost.value / period.days)
		return sum + perLicenseUnused
	}, 0) * initialLicenseCount.value
})

const totalWithoutDiscount = computed(
	() => desiredLicenseCount.value * monthlyCost.value * monthsToBill.value,
)

const discountValue = computed(() => {
	const capped = Math.min(rawDiscount.value, totalWithoutDiscount.value)
	return Number.isFinite(capped) ? capped : 0
})

const totalWithDiscount = computed(() => totalWithoutDiscount.value - discountValue.value)

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const summary = computed(() => ({
	base: totalWithoutDiscount.value,
	discount: discountValue.value,
	final: totalWithDiscount.value,
	baseFormatted: currencyFormatter.format(totalWithoutDiscount.value),
	discountFormatted: currencyFormatter.format(discountValue.value),
	finalFormatted: currencyFormatter.format(totalWithDiscount.value),
}))

const hasSummaryData = computed(
	() => monthsToBill.value > 0 && monthlyCost.value > 0 && desiredLicenseCount.value > 0,
)
</script>

<template>
	<div>
		<h3>Prompt:</h3>
		<pre>дано:
* x: дата последней покупки лицензий
* y: дата текущего дня (имитация now)
* costPerPiece: цена за одну лицензию
* initCount: текущие кол-во оплаченных лицензий
* newCount: заказонное кол-во лицензий которое хотим оплатить
* months: выбранное кол-во месяцев оплаты

нужно решить такие проблемы:
* понимать сколько стоит 1 лицензия в рамках 1-го дня (внимательно смотри так как разное кол-во дней в месяцах использую либу dayjs)
* рассчитать скидку за уже оплачиваемые лицензии (так как момент оплаты это y - дата)
* показать полную сумму и со скидкой

style:
* все расчеты должны быть в computed vue3</pre>
	</div>

	<div class="flex gap-[8px]">
		<section class="flex flex-col gap-[16px]">
			<h3 class="mb-[-8px]">
				Refs:
			</h3>

			<label for="costPerPiece" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Cost per Piece:</span>
				<input id="costPerPiece" v-model.number="costPerPiece" type="number" min="0" step="1" />
			</label>
			<label for="initCount" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Init Count:</span>
				<input id="initCount" v-model.number="initCount" type="number" min="0" step="1" />
			</label>
			<label for="newCount" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>New Count:</span>
				<input id="newCount" v-model.number="newCount" type="number" :min="initCount" step="1" />
			</label>
			<label for="months" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Months:</span>
				<input id="months" v-model.number="months" type="number" min="0" step="1" />
			</label>
			<label for="x" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>X:</span>
				<input id="x" v-model="x" type="date" />
			</label>
			<label for="y" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Y:</span>
				<input id="y" v-model="y" type="date" />
			</label>
		</section>
		<section class="flex flex-col gap-[16px]">
			<h3 class="mb-[-8px]">
				Computed:
			</h3>

			<div class="p-[12px] border rounded bg-white/20">
				<h4 class="mb-[8px]">
					Итог
				</h4>
				<p v-if="!hasSummaryData">
					Заполните стоимость, количество лицензий и месяцев для расчёта.
				</p>
				<template v-else>
					<p>Базовая стоимость: {{ summary.baseFormatted }}</p>
					<p>Скидка за уже оплаченные лицензии: −{{ summary.discountFormatted }}</p>
					<p class="font-semibold">
						Итого к оплате: {{ summary.finalFormatted }}
					</p>
				</template>
			</div>
			<div class="p-[12px] border rounded bg-white/20">
				<h4 class="mb-[8px]">
					Стоимость 1 лицензии в день
				</h4>
				<p v-if="!invoicePeriods.length">
					Укажите дату Y и количество месяцев, чтобы увидеть расчёт по дням.
				</p>
				<ul v-else class="flex flex-col gap-[8px]">
					<li v-for="period in dailyCostBreakdown" :key="period.key">
						<span class="block">{{ period.label }}</span>
						<span class="text-sm font-semibold">{{ period.days }} дн. · {{ currencyFormatter.format(period.dailyCost) }} / день</span>
					</li>
				</ul>
			</div>
			<div class="p-[12px] border rounded bg-white/20">
				<h4 class="mb-[8px]">
					Разница по дням между датами
				</h4>
				<p v-if="daysDifference === null">
					Заполните даты X и Y, чтобы рассчитать разницу.
				</p>
				<p v-else>
					{{ daysDifference }} дн.
				</p>
			</div>
		</section>
	</div>
</template>
