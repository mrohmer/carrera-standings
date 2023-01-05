<script lang="ts">
	import type { Cup } from '$lib/models';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
	}

	export let data: Data;

	$: hasDefaultInfoTable =
		['trackLength', 'pitLaneLength'].some((key) => !!data.cup?.info[key]) || !!data.cup?.date;
	$: hasRecordTable = !!data.cup?.info?.record;
	$: totalRounds =
		hasDefaultInfoTable && data.cup.info.trackLength
			? Math.ceil(305000 / data.cup.info.trackLength)
			: undefined;
</script>

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
							>{data.cup.info.trackLength} cm
						</td>
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
							>{data.cup.info.pitLaneLength} cm
						</td>
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

<style lang="postcss">
	table {
		border-collapse: collapse;
		width: 100%;
	}

	.layout {
		width: 100%;
		margin: 0 0 10px;
	}

	.layout img {
		width: 100%;
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
	}

	.info-table__item {
		padding: 10px;
		width: 50%;
	}

	.info-table__item--label {
		text-align: right;
	}
</style>
