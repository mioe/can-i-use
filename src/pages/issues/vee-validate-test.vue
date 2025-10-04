<script setup lang="ts">
import { Field, Form } from 'vee-validate'

const schema = {
	email: 'required',
}

function submit() {
	console.log('🦕 submit')
}
</script>

<template>
	<Form v-slot="{ errors }" :validation-schema="schema" @submit="submit">
		<Field name="email" />
		<span class="text-red">{{ errors.email }}</span>
		<button>Submit</button>
	</Form>
</template>
