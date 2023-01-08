import type { Load, LoadEvent } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

const loadCups = async ({ fetch, params }: LoadEvent) => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/cups`);
	return await response.json();
};
const loadYears = async ({ fetch }: LoadEvent) => {
	const response = await fetch(`/api/years`);
	return await response.json();
};
export const load: Load = async (event) => {
	const cups = await loadCups(event);
	const years = await loadYears(event);
	return {
		cups,
		years
	};
};
