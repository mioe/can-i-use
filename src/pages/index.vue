<script setup lang="ts">
import { dependencies, devDependencies } from '../../package.json'

const buildDate = import.meta.env.VITE_BUILD_DATE
</script>

<template>
	<main class="p-[8px] pb-[48px] flex flex-col gap-[16px] items-center justify-center">
		<section class="flex flex-col gap-[8px] items-center">
			<h2>Vue playground for testing</h2>
			<div class="flex flex-wrap gap-[8px] items-start justify-center">
				<div class="grid-border-color p-[4px] border rounded bg-white/30 w-full dark:bg-black/20 md:w-auto">
					<p>dependencies:</p>
					<pre class="text-wrap">{{ dependencies }}</pre>
				</div>
				<div class="grid-border-color p-[4px] border rounded bg-white/30 w-full dark:bg-black/20 md:w-auto">
					<p>devDependencies:</p>
					<pre class="text-wrap">{{ devDependencies }}</pre>
				</div>
			</div>
		</section>

		<div class="flex flex-wrap gap-x-[32px] gap-y-[16px]">
			<section class="flex flex-col gap-[8px]">
				<h2>Fonts</h2>
				<div class="flex flex-col flex-wrap gap-[8px] items-start justify-center">
					<a href="https://github.com/iaolo/iA-Fonts" target="_blank" style="font-family: 'iA Writer Quattro';">iA Writer Quattro 000</a>
					<a href="https://github.com/JetBrains/JetBrainsMono" target="_blank" style="font-family: 'JetBrains Mono';">JetBrains Mono 001</a>
					<a href="https://github.com/cyrealtype/Lora-Cyrillic" target="_blank" style="font-family: 'Lora';">Lora 002</a>
				</div>
			</section>

			<section class="flex flex-col gap-[8px]">
				<h2>Last build</h2>
				<p>{{ useTimeAgo(new Date(buildDate)) }}</p>
			</section>

			<section class="flex flex-col gap-[8px]">
				<h2>Repo</h2>
				<a href="https://github.com/mioe/can-i-use" target="_blank">github.com/mioe/can-i-use</a>
			</section>
		</div>
	</main>
</template>
