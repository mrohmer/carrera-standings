<script lang="ts">
	import type { Cup, Racers } from '$lib/models';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		racers: Racers;
	}

	export let data: Data;
</script>

<table>
	<thead>
		<tr class="row row--head">
			<th class="cell cell--head cell--position">Startnummer</th>
			<th class="cell cell--head cell--name">Fahrer</th>
			<th class="cell cell--head">Start in Runde</th>
			{#if data.cup.info.trackLength}
				<th class="cell cell--head">Mehrstrecke</th>
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each Object.entries(data.cup.startOrderForMainRace).sort( ([, a], [, b]) => (a < b ? -1 : 1) ) as [racer, rounds], index}
			<tr class="row">
				<th class="cell cell--position">
					{index + 1}
				</th>
				<td class="cell cell--name">
					<div class="cell__line">
						{racer}
					</div>
					<div class="cell__subline">
						{data.racers[racer].manufacturer}
					</div>
				</td>
				<td class="cell">{rounds}</td>
				{#if data.cup.info.trackLength}
					<td class="cell">
						{#if rounds !== 0}
							{((rounds * data.cup.info.trackLength) / 100).toFixed(2)} m
						{/if}
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	table {
		border-collapse: collapse;
		width: 100%;
	}
</style>
