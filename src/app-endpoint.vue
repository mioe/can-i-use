<script setup lang="ts">
import AppSuspense from '~/app-suspense.vue'
import AppHeader from '~/components/app-header/app-header.vue'
</script>

<template>
	<AppHeader />

	<Suspense>
		<AppSuspense />

		<template #fallback>
			Loading...
		</template>
	</Suspense>
</template>
