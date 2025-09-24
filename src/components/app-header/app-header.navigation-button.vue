<script setup lang="ts">
import { logicAnd } from '@vueuse/math'

import NavigationDialog from '~/components/navigation-dialog/navigation-dialog.vue'

const navigationDialogRef = shallowRef<InstanceType<typeof NavigationDialog> | undefined>()
const activeElement = useActiveElement()
const notUsingInput = computed(() =>
	activeElement.value?.tagName !== 'INPUT'
	&& activeElement.value?.tagName !== 'TEXTAREA')
const { meta, k } = useMagicKeys()
whenever(logicAnd(meta, k, notUsingInput), () => {
	navigationDialogRef.value?.open()
})
</script>

<template>
	<button aria-label="Command menu" type="button" class="text-sm text-black tracking-tight px-2.5 border border-transparent rounded-sm flex gap-1.5 h-8 cursor-pointer select-none text-nowrap transition-colors duration-75 items-center justify-center dark:text-offgray-50 px-1! hover:bg-offgray-100/50 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-offgray-500/10 lg:active:translate-y-px lg:active:scale-[.99]" @click="navigationDialogRef?.open()">
		<div class="i-mi:carbon-search h-[15px] w-[15px]" />
		<kbd aria-hidden="false" class="text-[.6875rem] text-gray-500 font-bold px-1.5 border border-gray-500/20 rounded-xs bg-gray-50/50 flex flex gap-0.5 items-center items-center dark:text-gray-300 dark:border-offgray-400/10 dark:bg-cream-900/10">
			<div class="i-mi:CarbonMacCommand h-[10px] w-[10px]" :class="[{ 'primary-color': meta }]" />
			<span :class="[{ 'primary-color': meta && k }]">+</span>
			<span :class="[{ 'primary-color': k }]">K</span>
		</kbd>
	</button>

	<NavigationDialog ref="navigationDialogRef" />
</template>
