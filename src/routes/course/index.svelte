<script lang="ts" context="module">
	import type { Load, LoadInput } from '@sveltejs/kit';
	import type { Course } from '$lib/models';

	export const prerender = true;

	export const loadCourse = async ({ fetch }: LoadInput): Promise<Record<'course', Course>> => {
		const response = await fetch('/api/course');
		const course = await response.json();
		return { course };
	};
	export const loadRacers = async ({ fetch }: LoadInput): Promise<Record<'racers', string[]>> => {
		const response = await fetch('/api/racers');
		const racers = await response.json();
		return { racers };
	};
	export const load: Load = async (input) => {
		const results = await Promise.all([loadCourse(input), loadRacers(input)]);
		const props = results.reduce(
			(prev, curr) => ({
				...prev,
				...curr
			}),
			{}
		);
		return {
			props
		};
	};
</script>

<script lang="ts">
	import type { Course, CourseCup, Racers } from '$lib/models';
	import { Tab, TabContent, Tabs } from 'svelte-materialify';
	import Chart from './_Chart.svelte';

	export let course: Course;
	export let racers: Racers;

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
		<Chart {course} {racers} mapOrder={orderMappingTotal} />
	</TabContent>

	<TabContent>
		<Chart {course} {racers} mapOrder={orderMappingInCup} />
	</TabContent>
</Tabs>
