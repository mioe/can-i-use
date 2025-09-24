<script setup lang="ts">
import type { Dayjs } from 'dayjs'

import dayjs from 'dayjs'
import { computed, ref } from 'vue'

import PromptRaw from './prompt.md?raw'

const costPerPiece = ref(500)
const initCount = ref(4)
const newCount = ref(5)
const months = ref(2)

const now = dayjs()

const expAt = ref(now.add(2, 'months').format('YYYY-MM-DD'))
const nowAt = ref(now.format('YYYY-MM-DD'))

const nowAtDate = computed(() => dayjs(nowAt.value).startOf('day'))
const expAtDate = computed(() => dayjs(expAt.value).startOf('day'))

const normalizedMonths = computed(() => Math.max(0, Math.trunc(months.value)))

const extensionStartDate = computed(() => {
	const nowDate = nowAtDate.value
	const expDate = expAtDate.value
	if (!expDate.isValid() && !nowDate.isValid()) {
		return expDate
	}
	if (!expDate.isValid()) {
		return nowDate
	}
	if (!nowDate.isValid()) {
		return expDate
	}
	return expDate.isBefore(nowDate) ? nowDate : expDate
})

const extensionEndDate = computed(() => {
	const start = extensionStartDate.value
	if (!start.isValid()) {
		return start
	}
	return start.add(normalizedMonths.value, 'month')
})

const extensionDurationDays = computed(() => {
	const start = extensionStartDate.value
	const end = extensionEndDate.value
	if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
		return 0
	}
	return end.diff(start, 'day')
})

const fullPrice = computed(() => {
	const start = extensionStartDate.value
	const end = extensionEndDate.value
	if (!start.isValid() || !end.isValid() || !end.isAfter(start) || newCount.value <= 0 || costPerPiece.value <= 0) {
		return 0
	}
	return calculateRangeCost(start, end, newCount.value)
})

const averageDiscountDailyPrice = computed(() => {
	const start = nowAtDate.value
	const end = expAtDate.value
	if (!start.isValid() || !end.isValid() || costPerPiece.value <= 0) {
		return 0
	}

	const monthsDiff = end.diff(start, 'month', true)
	if (monthsDiff <= 0) {
		return costPerPiece.value / start.daysInMonth()
	}

	const daysCount = Math.max(end.diff(start, 'day'), 1)
	const averageDaysInMonth = daysCount / monthsDiff
	if (!Number.isFinite(averageDaysInMonth) || averageDaysInMonth <= 0) {
		return 0
	}

	return costPerPiece.value / averageDaysInMonth
})

const discount = computed(() => {
	const start = nowAtDate.value
	const end = expAtDate.value
	if (!start.isValid() || !end.isValid() || initCount.value <= 0 || costPerPiece.value <= 0) {
		return 0
	}

	const daysCount = Math.max(end.diff(start, 'day'), 0)
	if (daysCount <= 0) {
		return 0
	}

	const averageDailyPrice = averageDiscountDailyPrice.value
	if (averageDailyPrice <= 0) {
		return 0
	}

	return Number((averageDailyPrice * daysCount * initCount.value).toFixed(2))
})

const totalToPay = computed(() => {
	const result = fullPrice.value - discount.value
	return result > 0 ? result : 0
})

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

interface RangeSegment {
	start: Dayjs
	end: Dayjs
	days: number
	perDay: number
	monthDays: number
}

const extensionSegments = computed<RangeSegment[]>(() => {
	const start = extensionStartDate.value
	const end = extensionEndDate.value
	if (!start.isValid() || !end.isValid() || !end.isAfter(start) || costPerPiece.value <= 0) {
		return []
	}
	return buildRangeSegments(start, end)
})

const nextPaymentDate = computed(() => extensionEndDate.value)

function calculateRangeCost(start: Dayjs, end: Dayjs, count: number) {
	let total = 0
	let cursor = start

	while (cursor.isBefore(end)) {
		const monthDays = cursor.daysInMonth()
		const nextMonthStart = cursor.endOf('month').add(1, 'day').startOf('day')
		const chunkEnd = nextMonthStart.isBefore(end) ? nextMonthStart : end
		const daysCount = chunkEnd.diff(cursor, 'day')

		if (daysCount <= 0) {
			break
		}

		const perDay = costPerPiece.value / monthDays
		total += perDay * daysCount * count
		cursor = chunkEnd
	}

	return Number(total.toFixed(2))
}

function buildRangeSegments(start: Dayjs, end: Dayjs): RangeSegment[] {
	const segments: RangeSegment[] = []
	let cursor = start

	while (cursor.isBefore(end)) {
		const monthDays = cursor.daysInMonth()
		const nextMonthStart = cursor.endOf('month').add(1, 'day').startOf('day')
		const chunkEnd = nextMonthStart.isBefore(end) ? nextMonthStart : end
		const daysCount = chunkEnd.diff(cursor, 'day')

		if (daysCount <= 0) {
			break
		}

		const perDay = costPerPiece.value / monthDays
		segments.push({
			start: cursor,
			end: chunkEnd,
			days: daysCount,
			perDay,
			monthDays,
		})
		cursor = chunkEnd
	}

	return segments
}

const formatCurrency = (value: number) => currencyFormatter.format(value || 0)
const formatDate = (value: Dayjs) => (value?.isValid() ? value.format('DD MMM YYYY') : '—')
</script>

<template>
	<section>
		<h3>Prompt</h3>
		<pre class="text-[12px] text-wrap">{{ PromptRaw }}</pre>
	</section>

	<div class="flex flex-wrap gap-[16px]">
		<section class="flex flex-col gap-[16px] min-w-[200px]">
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
			<label for="expAt" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Exp At:</span>
				<input id="expAt" v-model="expAt" type="date" />
			</label>
			<label for="nowAt" class="p-[4px] border rounded bg-white/30 flex flex-col max-w-[200px]">
				<span>Now At:</span>
				<input id="nowAt" v-model="nowAt" type="date" />
			</label>
		</section>

		<section class="flex flex-1 flex-col gap-[16px] min-w-[200px]">
			<h3 class="mb-[-8px]">
				Computed:
			</h3>

			<div class="flex flex-col gap-[12px]">
				<article class="p-[16px] border rounded bg-white/70 flex flex-col gap-[8px]">
					<h4>Итог</h4>
					<p>Базовая стоимость: <strong>{{ formatCurrency(fullPrice) }}</strong></p>
					<p>Скидка за уже оплаченные лицензии: <strong>{{ formatCurrency(discount) }}</strong></p>
					<p>Итого к оплате: <strong>{{ formatCurrency(totalToPay) }}</strong></p>
					<p>Следующая оплата: <strong>{{ formatDate(nextPaymentDate) }}</strong></p>
				</article>

				<article class="p-[16px] border rounded bg-white/70 flex flex-col gap-[10px]">
					<h4>Стоимость 1 лицензии в день</h4>
					<p class="text-sm">
						Средняя: <strong>{{ formatCurrency(averageDiscountDailyPrice) }}</strong>
					</p>
					<ul class="flex flex-col gap-[10px]">
						<li
							v-for="segment in extensionSegments"
							:key="segment.start.toISOString()"
							class="flex flex-col"
						>
							<span>{{ formatDate(segment.start) }} → {{ formatDate(segment.end) }}</span>
							<span class="text-sm text-slate-600">{{ segment.days }} дн. из {{ segment.monthDays }} · {{ formatCurrency(segment.perDay) }} / день</span>
						</li>
					</ul>
				</article>

				<article class="p-[16px] border rounded bg-white/70 flex flex-col gap-[8px]">
					<h4>Разница по дням между датами</h4>
					<p>{{ extensionDurationDays }} дн.</p>
				</article>
			</div>
		</section>
	</div>
</template>
