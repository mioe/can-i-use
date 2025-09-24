<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const child = router.options.routes.find(r => r.path === '/issues')?.children?.find(
	(r) => {
		const match = route.path.match(/\/issues\/([^/]+)/)
		const result = match ? match[1] : null
		return r.path === result
	},
)!.children?.reverse()

onMounted(() => {
	const lastVersion = child![0].path
	if (route.name === '/issues/month-diff-calc') {
		router.replace({ path: `${route.name}/${lastVersion}` })
	}
})
</script>

<template>
	<main class="p-[8px] pb-[48px] flex flex-col gap-[16px]">
		<header>
			<h2>month-diff-calc</h2>

			<nav class="flex flex-wrap gap-[8px]">
				<span>Versions:</span>
				<RouterLink
					v-for="c in child"
					:key="c.path"
					:to="c.path"
				>
					{{ c.path }}
				</RouterLink>
			</nav>
		</header>

		<RouterView />
	</main>
</template>
