<script lang="ts">
	import type { Cup, Racers } from '$lib/models';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		previous: Cup | undefined;
		racers: Racers;
	}

	export let data: Data;

	const NORMAL_TANK_VALUE = 5;
	const SECONDS_AVG_ROUND = 4;
	const SECONDS_PER_PIT_STOP = 5;
	const calcExpectedPitStops = (tankValue: number) => Math.ceil(totalRounds / (100 / tankValue));
	const calcTimeWithTankValue = (tankValue: number) => {
		const timeWithoutPitStop = totalRounds * SECONDS_AVG_ROUND;
		const timeInPit = calcExpectedPitStops(tankValue) * SECONDS_PER_PIT_STOP;
		return timeWithoutPitStop + timeInPit;
	};
	const calcExpectedDeterioration = (tankValue: number) => {
		const normal = calcTimeWithTankValue(NORMAL_TANK_VALUE);
		const withPenalty = calcTimeWithTankValue(tankValue);

		return withPenalty - normal;
	};
	const calcTankValue = (rank: number): number => Math.max(3 - rank, 0) + NORMAL_TANK_VALUE;

	$: hasDefaultInfoTable =
		['trackLength', 'pitLaneLength'].some((key) => !!data.cup?.info[key]) || !!data.cup?.date;
	$: hasRecordTable = !!data.cup?.info?.record;
	$: hasPenalties = !!data.previous?.order?.length;
	$: totalRounds =
		hasDefaultInfoTable && data.cup.info.trackLength
			? Math.ceil(305000 / data.cup.info.trackLength)
			: undefined;
</script>

<table>
	<thead>
		<tr class="row row--head">
			<th class="cell cell--head cell--position">Vorheriger<br />Rang</th>
			<th class="cell cell--head cell--name">Name</th>
			<th class="cell cell--head">Tankwert</th>
			{#if totalRounds}
				<th class="cell cell--head">Erwartete<br />Boxenstops</th>
				<th class="cell cell--head">Erwartete Verschlechterung<br />über alle Runden</th>
			{/if}
		</tr>
	</thead>

	{#if data.previous?.order?.length}
		<tbody>
			{#each data.previous.order as racer, index}
				<tr class="row">
					<th class="cell cell--position">{index + 1}</th>
					<td class="cell cell--name">
						<div class="cell__line">
							{racer}
						</div>
						<div class="cell__subline">
							{data.racers[racer].manufacturer}
						</div>
					</td>
					<td class="cell">
						{calcTankValue(index)}
					</td>
					{#if totalRounds}
						<td class="cell">
							{calcExpectedPitStops(calcTankValue(index))}
						</td>
						<td class="cell">
							{calcTankValue(index) !== NORMAL_TANK_VALUE
								? `${calcExpectedDeterioration(calcTankValue(index))}s`
								: '-'}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	{/if}
</table>

<style lang="postcss">
	table {
		border-collapse: collapse;
		width: 100%;
	}
</style>
