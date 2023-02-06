<script lang="ts">
	import { page } from '$app/stores';
	import '../../app.scss';
	import '../../app.css';
	import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { goto } from '$app/navigation';
	import { getYear } from '$lib/api/get-year.js';
	import YearDropdown from '$lib/components/YearDropdown.svelte';

	export let data: Record<'cups', Record<'slug' | 'title', string>[]> & Record<'years', number[]>;

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
		const year = parseInt($page.params.year ?? String(new Date().getFullYear()));
		const yearPrefix = year === new Date().getFullYear() ? '' : `/${year}`;
		const staticPages = ['/total', '/course'].map((path) => `${yearPrefix}${path}`);

		const url = $page.url.pathname;

		const indexInStaticPages = staticPages.findIndex((i) => url === i);

		if (indexInStaticPages >= 0) {
			const newIndex = indexInStaticPages + dir;

			if (newIndex < 0) {
				return data?.cups?.length
					? `${yearPrefix}/cups/${data.cups[data.cups.length - 1].slug}`
					: staticPages[staticPages.length - 1];
			}
			if (newIndex >= staticPages.length) {
				return data?.cups?.length ? `${yearPrefix}/cups/${data.cups[0].slug}` : staticPages[0];
			}

			return staticPages[newIndex];
		}

		if (data?.cups?.length) {
			const indexInCups = data.cups.findIndex((i) => {
				return decodeURIComponent(url) === `${yearPrefix}/cups/${i.slug}`;
			});

			if (indexInCups >= 0) {
				const newIndex = indexInCups + dir;

				if (newIndex < 0) {
					return staticPages[staticPages.length - 1];
				}
				if (newIndex >= data.cups.length) {
					return staticPages[0];
				}

				return `${yearPrefix}/cups/${data.cups[newIndex].slug}`;
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

	$: year = getYear($page);
	$: urlPrefix = year !== new Date().getFullYear() ? `/${year}` : undefined;
</script>

<svelte:head>
	<title>Carrera Rocks</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header class="flex content w-full justify-between">
	<YearDropdown {year} years={data.years} />

	<div class="flex-1 overflow-auto">
		<div class="w-full">
			<Navigation cups={data.cups} {urlPrefix} />
		</div>
	</div>
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
		overflow: visible !important;
		padding: 0;
		margin-bottom: 10px;
	}

	.main {
		min-height: 100vh;
	}
</style>
