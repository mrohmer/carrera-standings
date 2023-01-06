import type { Load, LoadEvent } from '@sveltejs/kit';
import type { Course } from '$lib/models';
import { getYear } from '$lib/api/get-year';

export const prerender = true;

const loadCourse = async ({ fetch, params }: LoadEvent): Promise<Record<'course', Course>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${params}/course`);
	const course = await response.json();
	return { course };
};
const loadRacers = async ({ fetch, params }: LoadEvent): Promise<Record<'racers', string[]>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${params}/racers`);
	const racers = await response.json();
	return { racers };
};
export const load: Load = async (input) => {
	const results = await Promise.all([loadCourse(input), loadRacers(input)]);
	return results.reduce(
		(prev, curr) => ({
			...prev,
			...curr
		}),
		{}
	);
};
