<script setup lang="ts">
import AppHeaderNavigationButton from './app-header.navigation-button.vue'
</script>

<template>
	<header class="grid-border-color p-[8px] border-b bg-[#f7f7f2f5] flex gap-[8px] w-full items-center left-0 top-0 justify-between sticky z-1 dark:bg-[hsl(218,_13%,_7.5%)]">
		<h1 class="text-[16px]">
			Can I Use (sandbox)
		</h1>
		<div class="flex gap-[8px] items-center">
			<AppHeaderNavigationButton />
		</div>
	</header>
</template>
