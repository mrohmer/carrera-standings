<script lang="ts" context="module">
	import type {Load} from '@sveltejs/kit';

	export const load: Load = async ({fetch}) => {
		const response = await fetch('/api/cups');
		const cups = await response.json();
		return {
			props: {
				cups,
			},
		};
	}

</script>
<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';

	export let cups: Record<'slug'|'title', string>
</script>

<style lang="scss">
	header {
		overflow: auto;
		padding: 0;
		margin-bottom: 10px;
		nav {
			display: flex;
			gap: 10px;

			a {
				color: #222;
				width: fit-content;
				white-space: nowrap;
				&.active {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}
</style>

<svelte:head>
	<title>Carrera Rocks</title>
	<meta name="robots" content="noindex">
</svelte:head>

<header>
	<nav>
		<a href="/" class:active={$page.url.pathname === '/'}>
			Gesamt
		</a>
		{#each cups as {title, slug}}
			<a href="/{slug}" class:active={$page.url.pathname === `/${slug}`}>
				{title}
			</a>
		{/each}
	</nav>
</header>
<main>
	<slot />
</main>
