<script lang="ts">
	import type { Cup, Racers } from '$lib/models';
	import { Tab, TabContent, Tabs } from 'svelte-materialify';
	import MayStillWinLegend from '$lib/components/MayStillWinLegend.svelte';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
		previous: Cup | undefined;
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

	$: hasStartOrderForMainRace =
		data.cup?.startOrderForMainRace && Object.keys(data.cup.startOrderForMainRace).length;
	$: hasDefaultInfoTable =
		['trackLength', 'pitLaneLength'].some((key) => !!data.cup?.info[key]) || !!data.cup?.date;
	$: hasRecordTable = !!data.cup?.info?.record;
	$: hasPenalties = !!data.previous?.order?.length;
	$: totalRounds =
		hasDefaultInfoTable && data.cup.info.trackLength
			? Math.ceil(305000 / data.cup.info.trackLength)
			: undefined;
</script>

{#if data.cup?.liveSessionId}
	<a href="https://carrera-live.rohmer.rocks/{data.cup.liveSessionId}" class="live-session">
		Live Session
	</a>
{/if}
<Tabs fixedTabs grow>
	<div slot="tabs">
		<Tab>Tabelle</Tab>
		<Tab>Info</Tab>
		{#if hasPenalties}
			<Tab>Tankmalus</Tab>
		{/if}
		{#if hasStartOrderForMainRace}
			<Tab>Startreihenfolge</Tab>
		{/if}
	</div>

	<TabContent>
		<table>
			<thead>
				<tr class="row row--head">
					<th class="cell cell--head cell--position">Rang</th>
					<th class="cell cell--head cell--name">Name</th>
					<th class="cell cell--head cell--total">Gesamt</th>
					<th class="cell cell--head cell--time-trial">Zeit</th>
					<th
						class="cell cell--head cell--main-race"
						class:cell--fastest-lap-set={!!data.cup?.fastestLap}>Haupt</th
					>
					<th class="cell cell--head">Strafe</th>
				</tr>
			</thead>

			{#if data.cup?.order?.length}
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
									<span class:strikethrough={data.cup.discardedResult?.includes(racer)}
										>{racer}</span
									>
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
			{/if}
		</table>

		{#if !data.cup?.order?.length}
			<div class="info-not-yet">
				{data.cup?.title ?? 'Cup'} noch nicht gewertet
			</div>
		{/if}

		<MayStillWinLegend />
	</TabContent>
	<TabContent>
		{#if data.cup?.layout}
			<div class="layout">
				<img src={data.cup.layout} alt="Streckenlayout" />
			</div>
		{/if}
		{#if hasDefaultInfoTable || hasRecordTable}
			{#if hasDefaultInfoTable}
				<h3 class="info-headline">Streckeninfo</h3>
				<table class="info-table">
					<tbody>
						{#if data.cup?.date}
							<tr class="info-table__row">
								<th class="info-table__item info-table__item--label">Datum</th>
								<td class="info-table__item info-table__item--value">{data.cup?.date}</td>
							</tr>
						{/if}
						{#if data.cup.info?.trackLength}
							<tr class="info-table__row">
								<th class="info-table__item info-table__item--label">Streckenlänge</th>
								<td class="info-table__item info-table__item--value"
									>{data.cup.info.trackLength} cm</td
								>
							</tr>
							<tr class="info-table__row">
								<th class="info-table__item info-table__item--label">Runden</th>
								<td class="info-table__item info-table__item--value">{totalRounds}</td>
							</tr>
						{/if}
						{#if data.cup.info?.pitLaneLength}
							<tr class="info-table__row">
								<th class="info-table__item info-table__item--label">Länge Box</th>
								<td class="info-table__item info-table__item--value"
									>{data.cup.info.pitLaneLength} cm</td
								>
							</tr>
						{/if}
					</tbody>
				</table>
			{/if}
			{#if hasRecordTable}
				<h3 class="info-headline">Bahnrekord</h3>
				<table class="info-table">
					<tbody>
						<tr class="info-table__row">
							<th class="info-table__item info-table__item--label"
								>{data.cup.info.record.racer ?? '-'}</th
							>
							<td class="info-table__item info-table__item--value">
								{data.cup.info.record.time ? `${data.cup.info.record.time}s` : '-'}
								{#if data.cup.info.record.date}
									({data.cup.info.record.date})
								{/if}
							</td>
						</tr>
					</tbody>
				</table>
			{/if}
		{:else}
			<div class="info-not-yet">
				Keine Infos zu {data.cup?.title ?? 'Cup'} hinterlegt
			</div>
		{/if}
	</TabContent>
	{#if hasPenalties}
		<TabContent>
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
		</TabContent>
	{/if}
	{#if hasStartOrderForMainRace}
		<TabContent>
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
		</TabContent>
	{/if}
</Tabs>

<style lang="scss">
	table {
		border-collapse: collapse;
		width: 100%;

		.cell {
			&--penalty {
				color: red;
			}

			&--fastest-lap-set {
				padding-left: 0;
				padding-right: 0;
			}
		}
	}

	.info-not-yet {
		font-size: 25px;
		text-align: center;
		padding: 30px 0;

		color: #444;
	}

	.info-headline {
		font-size: 20px;
		text-align: center;
		line-height: 20px;
		margin-top: 20px;
	}
	.info-table {
		margin: 0 0 50px;

		&__item {
			padding: 10px;
			width: 50%;

			&--label {
				text-align: right;
			}
		}
	}

	.layout {
		width: 100%;
		margin: 0 0 10px;

		img {
			width: 100%;
		}
	}

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

		&:after {
			$size: 8px;
			content: '';
			display: inline-block;
			width: $size;
			height: $size;
			border-radius: 50%;
			background: #ff0000;
			vertical-align: top;
			margin: 3px 0 0 3px;

			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}
	}

	.strikethrough {
		text-decoration: line-through;
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
