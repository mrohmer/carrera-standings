<script lang="ts">
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';
	import type { Manufacturers, Racer, Racers, RacerStandings } from '$lib/models';

	export let data: Record<'standings', RacerStandings> &
		Record<'manufacturers', Manufacturers> &
		Record<'racers', Racers>;

	const round = (points: number) => Math.round(points * 100) / 100;

	$: racerNamesByManufacturer = data.manufacturers?.reduce(
		(prev, curr) => ({
			...prev,
			[curr.name]: Object.values(data.racers)
				.filter(({ manufacturer }) => manufacturer === curr.name)
				.map(({ key }) => key)
				.sort()
		}),
		{} as Record<string, string[]>
	);
</script>

{#if data?.standings?.standings?.length}
	<table>
		<thead>
			<tr class="row row--head">
				<th class="cell cell--head cell--position">Rang</th>
				<th class="cell cell--head cell--name">Fahrer</th>
				<th class="cell cell--head">Ø-Punkte</th>
				<th class="cell cell--head">Siege</th>
				<th class="cell cell--head">Podien</th>
				<th class="cell cell--head">Schnellste</th>
			</tr>
		</thead>
		<tbody>
			{#each data.standings.standings as { name, points, pointsWithDiscardedResults, fastestLaps, wins, podiums, mayStillWin }, index}
				<tr class="row">
					<th class="cell cell--position">{index + 1}</th>
					<td class="cell cell--name">
						<div class="cell__line">
							{name}
						</div>
						<div class="cell__subline">
							{racerNamesByManufacturer[name]?.join(', ')}
						</div>
					</td>
					<td class="cell">
						<div class="cell__line">
							{round(points ?? 0)}
						</div>
						{#if data.standings.hasDiscardedResults}
							<div class="cell__subline">
								({round(pointsWithDiscardedResults)})
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
{/if}

<style lang="scss">
	table {
		border-collapse: collapse;
		width: 100%;
	}
</style>
