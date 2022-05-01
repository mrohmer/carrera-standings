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
	import { page } from '$app/stores';
	import '../app.scss';
	import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
	import Navigation from '../lib/components/Navigation.svelte';
	import { goto } from '$app/navigation';

	export let cups: Record<'slug' | 'title', string>[];

	const swipe = async (node: HTMLElement) => {
		if (typeof window === 'undefined') {
			return;
		}
		const events: Array<string> = ['swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];
		const Hammer = await import('hammerjs');

		const hammer = new Hammer.default(node);
		for (const event of events) {
			hammer.on(event, (ev: any) => node.dispatchEvent(new CustomEvent(event, { detail: ev })));
		}
	};

	const getNextPath = (dir: number) => {
		const staticPages = ['/', '/course'];

		const url = $page.url.pathname;

		const indexInStaticPages = staticPages.findIndex((i) => url === i);

		if (indexInStaticPages >= 0) {
			const newIndex = indexInStaticPages + dir;

			if (newIndex < 0) {
				return cups?.length
					? `/${cups[cups.length - 1].slug}`
					: staticPages[staticPages.length - 1];
			}
			if (newIndex >= staticPages.length) {
				return cups?.length ? `/${cups[0].slug}` : staticPages[0];
			}

			return staticPages[newIndex];
		}

		if (cups?.length) {
			const indexInCups = cups.findIndex((i) => {
				return decodeURIComponent(url) === `/${i.slug}`;
			});

			if (indexInCups >= 0) {
				const newIndex = indexInCups + dir;

				if (newIndex < 0) {
					return staticPages[staticPages.length - 1];
				}
				if (newIndex >= cups.length) {
					return staticPages[0];
				}

				return `/${cups[newIndex].slug}`;
			}
		}

		return '/';
	};
	const swipeLeft = () => {
		const next = getNextPath(1);

		goto(next);
	};

	const swipeRight = () => {
		const next = getNextPath(-1);

		goto(next);
	};
</script>

<svelte:head>
	<title>Carrera Rocks</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header>
	<Navigation {cups} />
</header>
<div class="main" use:swipe on:swipeleft={swipeLeft} on:swiperight={swipeRight}>
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
</div>

<style lang="scss">
	header {
		overflow: hidden;
		padding: 0;
		margin-bottom: 10px;
	}

	.main {
		min-height: 100vh;
	}
</style>
