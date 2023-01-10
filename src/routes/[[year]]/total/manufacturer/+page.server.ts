import type { Load, LoadEvent } from '@sveltejs/kit';
import type { Manufacturers, Racers, RacerStandings } from '$lib/models';
import { getYear } from '$lib/api/get-year';

export const prerender = true;

const loadStandings = async ({
	fetch,
	params
}: LoadEvent): Promise<Record<'standings', RacerStandings>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/manufacturers/standings`);
	const standings = await response.json();
	return { standings };
};
const loadRacers = async ({ fetch, params }: LoadEvent): Promise<Record<'racers', Racers>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/racers`);
	const racers = await response.json();
	return { racers };
};
const loadManufacturers = async ({
	fetch,
	params
}: LoadEvent): Promise<Record<'manufacturers', Manufacturers>> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/manufacturers`);
	const manufacturers = await response.json();
	return { manufacturers };
};
export const load: Load = async (input) => {
	const results = await Promise.all([
		loadStandings(input),
		loadRacers(input),
		loadManufacturers(input)
	]);
	return results.reduce(
		(prev, curr) => ({
			...prev,
			...curr
		}),
		{}
	);
};
