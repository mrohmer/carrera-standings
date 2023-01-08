import type { Load, LoadEvent } from '@sveltejs/kit';
import type { Racers, Standings } from '$lib/models';
import { getYear } from '$lib/api/get-year';

export const prerender = true;

const loadStandings = async ({
	fetch,
	params
}: LoadEvent): Promise<Record<'standings', Standings>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/racers/standings`);
	const standings = await response.json();
	return { standings };
};
const loadRacers = async ({ fetch, params }: LoadEvent): Promise<Record<'racers', Racers>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/racers`);
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
