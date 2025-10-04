<template>
	<section class="flex flex-col w-full">
		<p class="text-[10px] font-mono mx-[8px] my-[2px] op-[80%] uppercase">
			Other
		</p>

		<div>
			<button
				tabindex="0"
				class="nav-item"
				@click="$emit('close')"
			>
				<div class="i-mi:vue h-[14px] w-[14px]" />
				<span>Close dialog</span>
			</button>
		</div>
	</section>
</template>
