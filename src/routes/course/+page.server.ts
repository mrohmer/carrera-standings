import type { Load, LoadEvent } from '@sveltejs/kit';
import type { Course } from '$lib/models';

export const prerender = true;

const loadCourse = async ({ fetch }: LoadEvent): Promise<Record<'course', Course>> => {
	const response = await fetch('/api/course');
	const course = await response.json();
	return { course };
};
const loadRacers = async ({ fetch }: LoadEvent): Promise<Record<'racers', string[]>> => {
	const response = await fetch('/api/racers');
	const racers = await response.json();
	return { racers };
};
export const load: Load = ({ parent }) => parent();
