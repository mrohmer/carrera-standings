import type { Load, LoadEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { Cup, Racers } from '$lib/models';
import { validateSlug } from '$lib/api/validate-slug';

export const prerender = true;

const loadCup = async ({
	fetch,
	params
}: LoadEvent): Promise<Cup & Record<'mayStillWin' | 'discardedResult', string[]>> => {
	const response = await fetch(`/api/cups/${params.slug}`);
	const cup = await response.json();
	if (!cup) {
		throw error(404);
	}
	return cup;
};
const loadPreviousCup = async ({ fetch, params }: LoadEvent): Promise<Cup> => {
	const response = await fetch(`/api/cups/${params.slug}/previous`);
	return await response.json();
};
const loadRacers = async ({ fetch }: LoadEvent): Promise<Record<'racers', Racers>> => {
	const response = await fetch('/api/racers');
	return await response.json();
};
export const load: Load = async (event: LoadEvent) => {
	if (!validateSlug(event)) {
		throw error(400);
	}
	const cup = await loadCup(event);
	const previous = await loadPreviousCup(event);
	const racers = await loadRacers(event);

	return { cup, previous, racers };
};
