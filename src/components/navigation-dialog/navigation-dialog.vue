<script setup lang="ts">
import NavigationDialogTheme from './navigation-dialog.theme.vue'

const navigationDialogRef = shallowRef<HTMLDialogElement | undefined>()

function open() {
	navigationDialogRef.value?.showModal()
}

defineExpose({
	open,
})
</script>

<template>
	<Teleport to="body">
		<dialog
			ref="navigationDialogRef"
			class="text-offgray m-auto border border-gray-300 rounded-md bg-white overflow-clip dark:text-offgray-300 dark:border-gray-600/20 dark:bg-[hsl(218,_13%,_9%)]"
		>
			<NavigationDialogTheme />

			<footer class="p-2 border-t border-gray-200 gap-[10px] hidden items-center bottom-0 left-0 justify-end sticky z-1 dark:border-gray-600/20 md:flex">
				<div class="text-xs flex gap-[6px] items-center">
					<kbd aria-hidden="false" class="text-[.6875rem] text-gray-500 font-bold px-1.5 border border-gray-500/20 rounded-xs bg-gray-50/50 flex flex gap-0.5 items-center items-center dark:text-gray-300 dark:border-offgray-400/10 dark:bg-cream-900/10">
						esc
					</kbd>
					<span>to dismiss</span>
				</div>

				<hr class="text-gray-200 bg-gray-200 h-[16px] w-[1px] dark:text-gray-600/20 dark:bg-gray-600/20" />

				<div class="text-xs flex gap-[6px] items-center">
					<kbd aria-hidden="false" class="text-[.6875rem] text-gray-500 font-bold px-1.5 border border-gray-500/20 rounded-xs bg-gray-50/50 flex flex gap-0.5 items-center items-center dark:text-gray-300 dark:border-offgray-400/10 dark:bg-cream-900/10">
						tab
					</kbd>
					<span>to move</span>
				</div>

				<hr class="text-gray-200 bg-gray-200 h-[16px] w-[1px] dark:text-gray-600/20 dark:bg-gray-600/20" />

				<div class="text-xs flex gap-[6px] items-center">
					<kbd aria-hidden="false" class="text-[.6875rem] text-gray-500 font-bold px-1.5 border border-gray-500/20 rounded-xs bg-gray-50/50 flex flex gap-0.5 items-center items-center dark:text-gray-300 dark:border-offgray-400/10 dark:bg-cream-900/10">
						return
					</kbd>
					<span>to select</span>
				</div>
			</footer>
		</dialog>
	</Teleport>
</template>
