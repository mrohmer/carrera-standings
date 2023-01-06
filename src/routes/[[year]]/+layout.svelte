<script lang="ts">
	import { page } from '$app/stores';
	import '../../app.scss';
	import '../../app.css';
	import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { goto } from '$app/navigation';

	export let data: Record<'cups', Record<'slug' | 'title', string>[]>;

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
				return data?.cups?.length
					? `/${data.cups[data.cups.length - 1].slug}`
					: staticPages[staticPages.length - 1];
			}
			if (newIndex >= staticPages.length) {
				return data?.cups?.length ? `/${data.cups[0].slug}` : staticPages[0];
			}

			return staticPages[newIndex];
		}

		if (data?.cups?.length) {
			const indexInCups = data.cups.findIndex((i) => {
				return decodeURIComponent(url) === `/${i.slug}`;
			});

			if (indexInCups >= 0) {
				const newIndex = indexInCups + dir;

				if (newIndex < 0) {
					return staticPages[staticPages.length - 1];
				}
				if (newIndex >= data.cups.length) {
					return staticPages[0];
				}

				return `/${data.cups[newIndex].slug}`;
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
	<Navigation cups={data.cups} />
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
