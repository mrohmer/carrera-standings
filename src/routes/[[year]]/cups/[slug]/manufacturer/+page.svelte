<script lang="ts">
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';
	import type { Cup, Manufacturers, Racers } from '$lib/models';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		racers: Racers;
		manufacturers: Manufacturers;
	}

	export let data: Data;

	const round = (points: number) => Math.round(points * 100) / 100;
	const calcPosition = (index: number, points: number): number => {
		if (index <= 0) {
			return 1;
		}

		const prevDriver = data.cup?.order?.[index - 1];
		const prevPoints = prevDriver ? data.cup?.points?.total?.[prevDriver] : undefined;
		if (prevPoints && points === prevPoints) {
			return calcPosition(index - 1, prevPoints);
		}

		return index + 1;
	};
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

{#if data.cup?.manufacturerOrder?.length}
	<table>
		<thead>
			<tr class="row row--head">
				<th class="cell cell--head cell--position">Rang</th>
				<th class="cell cell--head cell--name">Name</th>
				<th class="cell cell--head cell--total">Ø-Gesamt</th>
				<th class="cell cell--head cell--time-trial">Ø-Zeit</th>
				<th
					class="cell cell--head cell--main-race"
					class:cell--fastest-lap-set={!!data.cup?.fastestLap}
				>
					Ø-Haupt
				</th>
				<th class="cell cell--head">Ø-Strafe</th>
			</tr>
		</thead>

		<tbody>
			{#each data.cup.manufacturerOrder as manufacturer, index}
				<tr class="row">
					<th class="cell cell--position">
						{calcPosition(index, data.cup.manufacturerPoints.total[manufacturer])}
					</th>
					<td class="cell cell--name">
						<div class="cell__line">
							<span>{manufacturer}</span>
						</div>
						<div class="cell__subline">
							{racerNamesByManufacturer[manufacturer]?.join(', ')}
						</div>
					</td>
					<td class="cell cell--total">
						{round(data.cup.manufacturerPoints.total[manufacturer] ?? 0)}
					</td>
					<td class="cell cell--time-trial">
						{round(data.cup.manufacturerPoints.timeTrial[manufacturer] ?? 0)}
					</td>
					<td
						class="cell cell--main-race"
						class:cell--fastest-lap={racerNamesByManufacturer[manufacturer]?.includes(
							data.cup.fastestLap
						)}
						class:cell--fastest-lap-set={!!data.cup.fastestLap}
					>
						<div class="cell__line">
							{round(
								(data.cup.manufacturerPoints.mainRace[manufacturer] ?? 0) +
									(data.cup.manufacturerPoints.fastestLap[manufacturer] ?? 0)
							)}
						</div>

						{#if racerNamesByManufacturer[manufacturer]?.includes(data.cup.fastestLap)}
							<div class="cell__subline">(schnellste)</div>
						{/if}
					</td>
					<td class="cell cell--penalty">
						{data.cup.manufacturerPoints.penalty[manufacturer]
							? -round(data.cup.manufacturerPoints.penalty[manufacturer])
							: '-'}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

{#if !data.cup?.order?.length}
	<div class="text-center pt-4 text-sm text-gray-700 dark:text-gray-400">
		{data.cup?.title ?? 'Cup'} noch nicht gewertet
	</div>
{/if}

<style lang="postcss">
	table {
		border-collapse: collapse;
		width: 100%;
	}

	table .cell--penalty {
		color: red;
	}

	table .cell--fastest-lap-set {
		padding-left: 0;
		padding-right: 0;
	}
</style>
