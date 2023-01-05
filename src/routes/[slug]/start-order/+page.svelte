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

	table .cell--penalty {
		color: red;
	}

	table .cell--fastest-lap-set {
		padding-left: 0;
		padding-right: 0;
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

	.layout {
		width: 100%;
		margin: 0 0 10px;
	}

	.layout img {
		width: 100%;
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
	}

	.live-session:after {
		content: '';
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ff0000;
		vertical-align: top;
		margin: 3px 0 0 3px;

		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
