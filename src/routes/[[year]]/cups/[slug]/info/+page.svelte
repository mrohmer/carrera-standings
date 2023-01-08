<script lang="ts">
	import type { Cup } from '$lib/models';
	import TableRow from './components/TableRow.svelte';

	interface Data {
		cup: Cup & Record<'mayStillWin' | 'discardedResults', string[]>;
	}

	export let data: Data;

	$: hasDefaultInfoTable =
		['trackLength', 'pitLaneLength'].some((key) => !!data.cup?.info[key]) || !!data.cup?.date;
	$: hasRecordTable = !!data.cup?.info?.record;
	$: totalRounds =
		hasDefaultInfoTable && data.cup.info?.trackLength?.average
			? Math.ceil(305000 / data.cup.info.trackLength.average)
			: undefined;
</script>

{#if data.cup?.layout}
	<div class="mb-2.5 w-full">
		<img src={data.cup.layout} alt="Streckenlayout" class="w-full" />
	</div>
{/if}
<h3 class="info-headline">Generell</h3>
<table class="mb-12">
	<tbody>
		<TableRow title="Datum">
			{data.cup?.date}
		</TableRow>
	</tbody>
</table>
{#if hasDefaultInfoTable}
	<h3 class="info-headline">Streckeninfo</h3>
	<table class="mb-12">
		<tbody>
			{#if totalRounds}
				<TableRow title="Runden">
					{totalRounds}
				</TableRow>
			{/if}
			{#if data.cup.info?.trackLength?.average}
				<TableRow title="Streckenlänge">
					{data.cup.info.trackLength.average} cm
				</TableRow>
			{/if}
			{#if data.cup.info?.trackLength?.innerTrack}
				<TableRow title="Streckenlänge" hint="Innere Bahn">
					{data.cup.info.trackLength.innerTrack} cm
				</TableRow>
			{/if}
			{#if data.cup.info?.trackLength?.outerTrack}
				<TableRow title="Streckenlänge" hint="Äußere Bahn">
					{data.cup.info.trackLength.outerTrack} cm
				</TableRow>
			{/if}
			{#if data.cup.info?.pitLaneLength}
				<TableRow title="Länge Box">
					{data.cup.info.pitLaneLength} cm
				</TableRow>
			{/if}
		</tbody>
	</table>
{/if}
{#if hasRecordTable}
	<h3 class="info-headline">Bahnrekord</h3>
	<table class="mb-12">
		<tbody>
			<TableRow title={data.cup.info.record.racer ?? '-'}>
				{data.cup.info.record.time ? `${data.cup.info.record.time}s` : '-'}
				{#if data.cup.info.record.date}
					({data.cup.info.record.date})
				{/if}
			</TableRow>
		</tbody>
	</table>
{/if}

<style lang="postcss">
	table {
		border-collapse: collapse;
		width: 100%;
	}

	.info-headline {
		font-size: 20px;
		text-align: center;
		line-height: 20px;
		margin-top: 20px;
	}
</style>
