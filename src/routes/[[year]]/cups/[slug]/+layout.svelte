<script lang="ts">
	import type { Cup, Racers } from '$lib/models';
	import { page } from '$app/stores';
	import { getYear } from '$lib/api/get-year';
	import type { Settings } from '$lib/models/settings';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		previous: Cup | undefined;
		racers: Racers;
		settings: Settings;
	}

	export let data: Data;

	$: hasStartOrderForMainRace =
		data.cup?.startOrderForMainRace && Object.keys(data.cup.startOrderForMainRace).length;
	$: hasPenalties = !!data.previous?.order?.length;
	$: tabs = {
		'': data.settings?.hasTeamRating ? 'Fahrerwertung' : 'Tabelle',
		...(data.settings?.hasTeamRating ? { '/manufacturer': 'Konstrukteurswertung' } : {}),
		'/info': 'Info',
		...(hasPenalties ? { '/penalties': 'Tankmalus' } : {}),
		...(hasStartOrderForMainRace ? { '/start-order': 'Startreihenfolge' } : {})
	};
	$: year = getYear($page);
	$: urlPrefix = year !== new Date().getFullYear() ? `/${year}` : '';
</script>

{#if data.cup?.liveSessionId}
	<a href="https://carrera-live.rohmer.rocks/{data.cup.liveSessionId}" class="live-session">
		Live Session
	</a>
{/if}
<div class="border-b border-gray-200 dark:border-gray-700 mb-2">
	<ul
		class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
	>
		{#each Object.entries(tabs) as [path, label]}
			{@const href = `${urlPrefix}/cups/${data.cup.slug}${path}`}
			{@const isActive = $page.url.pathname === encodeURI(href)}
			<li class="md:mr-2">
				<a
					{href}
					class="inline-block py-4 px-2 md:px-4 border-b-2 rounded-t-l transition-colors"
					class:border-transparent={!isActive}
					class:hover:text-gray-600={!isActive}
					class:hover:border-gray-300={!isActive}
					class:dark:hover:text-gray-300={!isActive}
					class:border-red-600={isActive}
					class:text-red-600={isActive}
					class:dark:text-red-500={isActive}
					class:dark:border-red-500={isActive}
					aria-current={isActive ? 'page' : undefined}
				>
					{label}
				</a>
			</li>
		{/each}
	</ul>
</div>

<slot />

<style lang="postcss">
	.live-session {
		display: block;
		width: fit-content;
		max-width: 75%;
		margin: 20px auto 30px;
		text-align: center;
		text-decoration: none;
		border: 2px solid white;
		padding: 15px 30px;
		color: white;
		font-weight: bold;
		font-size: 20px;
	}
	.live-session:after {
		content: '';
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ff0000;
		vertical-align: top;
		margin: 3px 0 0 3px;

		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
</style>
