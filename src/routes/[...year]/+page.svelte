<script lang="ts">
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';
	import type { Racers, Standings } from '$lib/models';

	export let data: Record<'standings', Standings> & Record<'racers', Racers>;
</script>

<table>
	<thead>
		<tr class="row row--head">
			<th class="cell cell--head cell--position">Rang</th>
			<th class="cell cell--head cell--name">Fahrer</th>
			<th class="cell cell--head">Punkte</th>
			<th class="cell cell--head">Siege</th>
			<th class="cell cell--head">Podien</th>
			<th class="cell cell--head">Schnellste</th>
		</tr>
	</thead>
	<tbody>
		{#each data.standings.standings as { name, points, pointsWithDiscardedResults, fastestLaps, wins, podiums, mayStillWin }, index}
			<tr class="row">
				<th class="cell cell--position">{index + 1}{@html mayStillWin ? '*' : '&nbsp;'}</th>
				<td class="cell cell--name">
					<div class="cell__line">
						{name}
					</div>
					<div class="cell__subline">
						{data.racers[name].manufacturer}
					</div>
				</td>
				<td class="cell">
					<div class="cell__line">
						{points}
					</div>
					{#if data.standings.hasDiscardedResults}
						<div class="cell__subline">
							({pointsWithDiscardedResults})
						</div>
					{/if}
				</td>
				<td class="cell">{wins}</td>
				<td class="cell">{podiums}</td>
				<td class="cell">{fastestLaps}</td>
			</tr>
		{/each}
	</tbody>
</table>

<MayStillWinLegend />

<style lang="scss">
	table {
		border-collapse: collapse;
		width: 100%;
	}
</style>
