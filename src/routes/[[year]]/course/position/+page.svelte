<script lang="ts">
	import type { Course, CourseCup, Racers } from '$lib/models';
	import Chart from '$lib/components/Chart.svelte';

	export let data: Record<'course', Course> & Record<'racers', Racers>;

	const orderMappingInCup = (key: string, { cup }: CourseCup): number | null =>
		cup.order?.length ? [...cup.order]?.reverse().indexOf(key) : null;
</script>

{#if data.course?.length}
	<Chart course={data.course} racers={data.racers} mapOrder={orderMappingInCup} />
{/if}
