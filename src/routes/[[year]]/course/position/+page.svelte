<script lang="ts">
	import type { Course, CourseCup, Racers } from '$lib/models';
	import Chart from '$lib/components/Chart.svelte';

	export let data: Record<'course', Course> & Record<'racers', Racers>;

	const orderMappingInCup = (key: string, { cup }: CourseCup): number | null => {
		if (!cup.order?.length) {
			return null;
		}
		if (!Object.values(cup.points?.total ?? {}).some((v) => v > 0)) {
			return null;
		}
		return [...cup.order]?.reverse().indexOf(key) ?? null;
	};
</script>

{#if data.course?.length}
	<Chart course={data.course} racers={data.racers} mapOrder={orderMappingInCup} />
{/if}
