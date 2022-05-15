<script lang="ts">
	import type { Racers, Course, CourseCup } from '../../lib/models';

	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';
	import AxisX from '$lib/components/chart/AxisX.svelte';
	import AxisY from '$lib/components/chart/AxisY.svelte';
	import MultiLine from '$lib/components/chart/MultiLine.svelte';
	import GroupLabels from '$lib/components/chart/GroupLabels.svelte';
	import { onMount } from 'svelte';

	export let mapOrder: (key: string, course: CourseCup) => number | null;
	export let racers: Racers;
	export let course: Course;

	let container: HTMLElement;
	let render = false;
	let observer: ResizeObserver;

	const xKey = 'cup';
	const yKey = 'rank';
	const zKey = 'racer';

	/* --------------------------------------------
	 * Make a flat array of the `values` of our nested series
	 * we can pluck the field set from `yKey` from each item
	 * in the array to measure the full extents
	 */
	const flatten = (data) =>
		data.reduce((memo, group) => {
			return memo.concat(group.values);
		}, []);

	// $: data = {
	//   labels: course.map(({cupTitle}) => cupTitle),
	//   datasets: racers
	//     .map((name) => ({
	//       name,
	//       values: course.map(({order}) => order ? [...order]?.reverse().indexOf(name) : null)
	//     })),
	// }
	// const lineOptions = {
	//   hideDots: true,
	// };

	onMount(() => {
		observer = new ResizeObserver((entries) => {
			render = entries
				.filter(({ borderBoxSize }) => borderBoxSize?.length)
				.some(({ borderBoxSize }) => borderBoxSize[0].inlineSize + borderBoxSize[0].blockSize > 0);
		});
	});

	$: container && observer.observe(container);
	$: seriesNames = racers ? Object.keys(racers) : [];
	$: seriesColors = racers ? Object.values(racers).map(({ color }) => color) : [];
	$: dataLong =
		course && mapOrder
			? seriesNames.map((key) => {
					return {
						[zKey]: key,
						values: course.map((c) => ({
							[xKey]: new Date(c.date),
							[yKey]: mapOrder(key, c)
						}))
					};
			  })
			: [];
</script>

<div class="chart">
	<div class="chart__container" bind:this={container}>
		{#if render}
			<LayerCake
				padding={{ top: 15, right: 10, bottom: 50, left: 25 }}
				x={xKey}
				y={yKey}
				z={zKey}
				yDomain={[0, null]}
				zScale={scaleOrdinal()}
				zDomain={seriesNames}
				zRange={seriesColors}
				flatData={flatten(dataLong)}
				data={dataLong}
			>
				<Svg>
					<AxisX
						gridlines={false}
						ticks={course.map((c) => new Date(c.date)).sort(({ date: a }, { date: b }) => +a - +b)}
						snapTicks={true}
						tickMarks={true}
						formatTick={(date) => course.find((c) => +new Date(c.date) === +date)?.cup.title}
					/>
					<AxisY ticks={4} formatTick={(rank) => Object.keys(racers).length - rank} />
					<MultiLine />
				</Svg>

				<Html>
					<GroupLabels />
				</Html>
			</LayerCake>
		{/if}
	</div>
</div>

<style lang="scss">
	/*
        The wrapper div needs to have an explicit width and height in CSS.
        It can also be a flexbox child or CSS grid element.
        The point being it needs dimensions since the <LayerCake> element will
        expand to fill it.
    */
	.chart {
		padding-top: 20px;
		&__container {
			width: 100%;
			height: 600px;
			max-height: calc(100vh - 150px);
		}
	}
</style>
