<script lang="ts">
	import { page } from '$app/stores';
	import { getYear } from '$lib/api/get-year';
	import type { Settings } from '$lib/models/settings';

	export let data: Record<'settings', Settings>;

	$: year = getYear($page);
	$: urlPrefix = year !== new Date().getFullYear() ? `/${year}` : '';
	$: tabs = data.settings?.hasTeamRating
		? {
				'': 'Fahrerwertung',
				'/manufacturer': 'Konstrukteurswertung'
		  }
		: undefined;
</script>

{#if tabs}
	<div class="border-b border-gray-200 dark:border-gray-700 mb-2">
		<ul
			class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
		>
			{#each Object.entries(tabs) as [path, label]}
				{@const href = `${urlPrefix}/total${path}`}
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
{/if}

<slot />
