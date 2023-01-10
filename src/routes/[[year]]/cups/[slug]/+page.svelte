<script lang="ts">
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';
	import type { Cup, Racers } from '$lib/models';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		racers: Racers;
	}

	export let data: Data;

	const getMainPoints = (racer: string): number | undefined => {
		const mainRace = data.cup.points.mainRace[racer];

		if (!(mainRace >= 0)) {
			return undefined;
		}

		return mainRace + +(data.cup.fastestLap === racer);
	};
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
</script>

{#if data.cup?.order?.length}
	<table>
		<thead>
			<tr class="row row--head">
				<th class="cell cell--head cell--position">Rang</th>
				<th class="cell cell--head cell--name">Name</th>
				<th class="cell cell--head cell--total">Gesamt</th>
				<th class="cell cell--head cell--time-trial">Zeit</th>
				<th
					class="cell cell--head cell--main-race"
					class:cell--fastest-lap-set={!!data.cup?.fastestLap}
					>Haupt
				</th>
				<th class="cell cell--head">Strafe</th>
			</tr>
		</thead>
		<tbody>
			{#each data.cup.order as racer, index}
				<tr class="row">
					<th class="cell cell--position"
						>{calcPosition(index, data.cup.points.total[racer])}{data.cup.mayStillWin?.includes(
							racer
						)
							? '*'
							: ' '}</th
					>
					<td class="cell cell--name">
						<div class="cell__line">
							<span class:strikethrough={data.cup.discardedResult?.includes(racer)}>{racer}</span>
							{#if data.cup.discardedResult?.includes(racer)}
								<span class="cell__subline">(Streichergebnis)</span>
							{/if}
						</div>
						<div class="cell__subline">
							{data.racers[racer].manufacturer}
						</div>
					</td>
					<td
						class="cell cell--total"
						class:strikethrough={data.cup.discardedResult?.includes(racer)}
					>
						{data.cup.points.total[racer] ?? '-'}
					</td>
					<td
						class="cell cell--time-trial"
						class:strikethrough={data.cup.discardedResult?.includes(racer)}
					>
						{data.cup.points.timeTrial[racer] ?? '-'}
					</td>
					<td
						class="cell cell--main-race"
						class:cell--fastest-lap={racer === data.cup.fastestLap}
						class:cell--fastest-lap-set={!!data.cup.fastestLap}
						class:strikethrough={data.cup.discardedResult?.includes(racer)}
					>
						<div class="cell__line">
							{getMainPoints(racer) ?? '-'}
						</div>

						{#if racer === data.cup.fastestLap}
							<div class="cell__subline">(schnellste)</div>
						{/if}
					</td>
					<td
						class="cell cell--penalty"
						class:strikethrough={data.cup.discardedResult?.includes(racer)}
					>
						{data.cup.points.penalty[racer] ? -data.cup.points.penalty[racer] : '-'}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<MayStillWinLegend />
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
