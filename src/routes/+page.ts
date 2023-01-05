import type { Load, LoadEvent } from '@sveltejs/kit';
import type { Racers, Standings } from '$lib/models';

export const prerender = true;

const loadStandings = async ({ fetch }: LoadEvent): Promise<Record<'standings', Standings>> => {
	const response = await fetch('/api/standings');
	const standings = await response.json();
	return { standings };
};
const loadRacers = async ({ fetch }: LoadEvent): Promise<Record<'racers', Racers>> => {
	const response = await fetch('/api/racers');
	const racers = await response.json();
	return { racers };
};
export const load: Load = async (input) => {
	const results = await Promise.all([loadStandings(input), loadRacers(input)]);
	return results.reduce(
		(prev, curr) => ({
			...prev,
			...curr
		}),
		{}
	);
};
