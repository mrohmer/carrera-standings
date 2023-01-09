<script lang="ts">
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';
	import type { Racers, RacerStandings } from '$lib/models';

	export let data: Record<'standings', RacerStandings> & Record<'racers', Racers>;
</script>

{#if data?.standings?.standings?.length}
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
							{points ?? 0}
						</div>
						{#if data.standings.hasDiscardedResults}
							<div class="cell__subline">
								({pointsWithDiscardedResults})
							</div>
						{/if}
					</td>
					<td class="cell">{wins ?? 0}</td>
					<td class="cell">{podiums ?? 0}</td>
					<td class="cell">{fastestLaps ?? 0}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<MayStillWinLegend />
{/if}

<style lang="scss">
	table {
		border-collapse: collapse;
		width: 100%;
	}
</style>
