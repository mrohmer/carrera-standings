<script lang="ts">
	import type { Course, CourseCup, Racers } from '$lib/models';
	import { Tab, TabContent, Tabs } from 'svelte-materialify';
	import Chart from './components/Chart.svelte';

	export let data: Record<'course', Course> & Record<'racers', Racers>;

	const orderMappingTotal = (key: string, { order }: CourseCup): number | null =>
		order ? [...order]?.reverse().indexOf(key) : null;

	const orderMappingInCup = (key: string, { cup }: CourseCup): number | null =>
		cup.order?.length ? [...cup.order]?.reverse().indexOf(key) : null;
</script>

<Tabs fixedTabs grow on:change={({ detail }) => console.log(detail)} active={0}>
	<div slot="tabs">
		<Tab>Gesamtpunkte</Tab>
		<Tab>Position</Tab>
	</div>

	<TabContent>
		<Chart course={data.course} racers={data.racers} mapOrder={orderMappingTotal} />
	</TabContent>

	<TabContent>
		<Chart course={data.course} racers={data.racers} mapOrder={orderMappingInCup} />
	</TabContent>
</Tabs>
