<script setup lang="ts">
const appStore = useAppStore()
</script>

<template>
	<section class="p-[4px] flex flex-col w-full">
		<p class="text-[10px] font-mono mx-[8px] my-[2px] op-[80%] uppercase">
			Switch theme
		</p>

		<div>
			<button
				class="text-[.875rem] p-2 rounded-sm flex shrink-0 gap-3 w-full cursor-pointer [content-visibility:_auto] items-center dark:text-white data-[selected=true]:bg-offgray-100/50 hover:bg-offgray-100/50 dark:data-[selected=true]:bg-offgray-950 dark:hover:bg-offgray-950"
				@click="appStore.theme = appStore.isDark ? 'light' : 'dark'"
			>
				<div class="i-mi:carbon-moon h-[14px] w-[14px] dark:i-mi:carbon-sun" />
				<span>{{ appStore.isDark ? 'Turn light mode on' : 'Turn dark mode on' }}</span>
			</button>
			<button
				class="text-[.875rem] p-2 rounded-sm flex shrink-0 gap-3 w-full cursor-pointer [content-visibility:_auto] items-center dark:text-white data-[selected=true]:bg-offgray-100/50 hover:bg-offgray-100/50 dark:data-[selected=true]:bg-offgray-950 dark:hover:bg-offgray-950" @click="appStore.theme = 'auto'"
			>
				<div class="i-mi:carbon-application-web h-[14px] w-[14px]" />
				<span>Follow the System's settings</span>
			</button>
		</div>
	</section>
</template>
