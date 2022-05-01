<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const response = await fetch('/api/cups');
		const cups = await response.json();
		return {
			props: {
				cups
			}
		};
	};
</script>

<script lang="ts">
	import '../app.scss';
	import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
	import Navigation from '../lib/components/Navigation.svelte';

	export let cups: Record<'slug' | 'title', string>;
</script>

<svelte:head>
	<title>Carrera Rocks</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header>
	<Navigation {cups} />
</header>
<main class="content">
	<slot />
</main>
<footer>
	<PoweredBy
		name="Matthias Rohmer"
		url="https://matthias.rohmer.rocks"
		technologies={['svelte', 'netlify']}
		sourceCodeUrl="https://github.com/mrohmer/carrera-standings"
	/>
</footer>

<style lang="scss">
	header {
		overflow: hidden;
		padding: 0;
		margin-bottom: 10px;
	}
</style>
