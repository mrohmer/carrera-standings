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
	import '../app.scss';

	export let cups: Record<'slug'|'title', string>
</script>

<style lang="scss">
	.content {
		margin: auto;
		max-width: 800px;
		overflow: hidden;
	}
	header {
		overflow: hidden;
		padding: 0;
		margin-bottom: 10px;

		nav {
			display: flex;
			gap: 10px;
			width: 100%;
			padding-bottom: 20px;

			a {
				color: #aaa;
				width: fit-content;
				white-space: nowrap;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}

				&.active {
					color: #fff;
					font-weight: bold;
				}
			}

			&.content {
				overflow: auto;
			}
		}
	}
</style>

<svelte:head>
	<title>Carrera Rocks</title>
	<meta name="robots" content="noindex">
</svelte:head>

<header>
	<nav class="content">
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
<main class="content">
	<slot />
</main>
